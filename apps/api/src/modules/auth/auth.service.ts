import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) { }

    async signup(email: string, password: string, name: string) {
        // Check if user exists
        const existing = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                clerkId: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Generate unique ID
                password: hashedPassword,
            },
        });

        // Generate token
        const token = this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    async login(email: string, password: string) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        if (!user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    private generateToken(userId: string, email: string): string {
        const secret = this.config.get<string>('JWT_SECRET') || 'default-secret-change-me';
        return jwt.sign(
            { userId, email },
            secret,
            { expiresIn: '7d' }
        );
    }

    verifyToken(token: string): { userId: string; email: string } {
        const secret = this.config.get<string>('JWT_SECRET') || 'default-secret-change-me';
        try {
            return jwt.verify(token, secret) as { userId: string; email: string };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }


}
