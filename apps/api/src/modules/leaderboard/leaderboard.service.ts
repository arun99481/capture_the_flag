import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class LeaderboardService {
    constructor(private prisma: PrismaService) { }

    async getStandings(eventId: string) {
        const teams = await this.prisma.team.findMany({
            where: { eventId },
            include: { progress: true },
            orderBy: [
                { progress: { totalPoints: 'desc' } },
                { progress: { lastUpdateTime: 'asc' } },
            ],
        });

        return teams.map((team, index) => ({
            rank: index + 1,
            teamId: team.id,
            name: team.name,
            points: team.progress?.totalPoints || 0,
        }));
    }
}
