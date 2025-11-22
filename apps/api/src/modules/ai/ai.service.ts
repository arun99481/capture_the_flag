import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AiService {
    constructor(private prisma: PrismaService) { }

    async getChallenge(challengeId: string) {
        const challenge = await this.prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new NotFoundException('Challenge not found');
        }

        return challenge;
    }

    async verifyAnswer(challengeId: string, userSubmission: string): Promise<boolean> {
        const challenge = await this.prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new NotFoundException('Challenge not found');
        }

        // Normalize strings for comparison
        const normalize = (str: string) => str.trim().toLowerCase().replace(/[^a-z0-9{}\-]/g, '');

        const normalizedExpected = normalize(challenge.flag);
        const normalizedUser = normalize(userSubmission);

        return normalizedExpected === normalizedUser;
    }
}
