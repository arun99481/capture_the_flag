import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class TeamsService {
    constructor(private prisma: PrismaService) { }

    private generateJoinCode(): string {
        return randomBytes(4).toString('hex').toUpperCase();
    }

    async create(userId: string, data: CreateTeamDto) {
        // Check if user is already in a team for this event
        const existingMember = await this.prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId: data.eventId },
            },
        });

        if (existingMember) {
            throw new BadRequestException('User already in a team for this event');
        }

        const joinCode = this.generateJoinCode();

        // Transaction to create team and add leader as member
        try {
            return await this.prisma.$transaction(async (tx) => {
                const team = await tx.team.create({
                    data: {
                        name: data.name,
                        eventId: data.eventId,
                        leaderUserId: userId,
                        joinCode,
                        progress: {
                            create: {
                                totalPoints: 0,
                            }
                        }
                    },
                });

                await tx.teamMember.create({
                    data: {
                        teamId: team.id,
                        userId,

                    },
                });

                return tx.team.findUnique({
                    where: { id: team.id },
                    include: { members: { include: { user: true } } }
                });
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Team name already taken');
            }
            throw error;
        }
    }

    async join(userId: string, joinCode: string) {
        const team = await this.prisma.team.findUnique({
            where: { joinCode },
            include: { event: true, members: true },
        });

        if (!team) throw new NotFoundException('Invalid join code');

        if (team.members.length >= team.event.maxTeamSize) {
            throw new BadRequestException('Team is full');
        }

        // Check if user is already in a team for this event
        const existingMember = await this.prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId: team.eventId },
            },
        });

        if (existingMember) {
            throw new BadRequestException('User already in a team for this event');
        }

        return this.prisma.teamMember.create({
            data: {
                teamId: team.id,
                userId,
            },
        });
    }

    async findMyTeam(userId: string, eventId: string) {
        const membership = await this.prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId },
            },
            include: { team: { include: { members: { include: { user: true } } } } },
        });

        return membership?.team || null;
    }
}
