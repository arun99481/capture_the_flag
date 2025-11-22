import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AiService } from '../ai/ai.service';
import { LeaderboardGateway } from '../leaderboard/leaderboard.gateway';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
        private leaderboardGateway: LeaderboardGateway,
        private leaderboardService: LeaderboardService, // To fetch fresh standings for broadcast
    ) { }

    async getStatus(userId: string, eventId: string) {
        const membership = await this.prisma.teamMember.findFirst({
            where: { userId, team: { eventId } },
            include: {
                team: {
                    include: {
                        progress: true,
                        event: {
                            include: {
                                challenges: {
                                    orderBy: { order: 'asc' }
                                }
                            }
                        },
                        interactions: true // Include interactions to check solved status
                    }
                }
            },
        });

        if (!membership) throw new NotFoundException('You are not in a team for this event');

        const team = membership.team;
        const solvedChallengeIds = team.interactions
            .filter(i => i.solved)
            .map(i => i.challengeId);

        return {
            team: {
                id: team.id,
                name: team.name,
                points: team.progress?.totalPoints || 0,
            },
            eventEndTime: team.event.eventEndTime,
            challenges: team.event.challenges.map(c => ({
                id: c.id,
                title: c.title,
                description: c.description,
                points: c.points,
                difficulty: c.difficulty,
                order: c.order,
                status: solvedChallengeIds.includes(c.id) ? 'SOLVED' : 'OPEN',
                // Include hint fields
                hint1: c.hint1,
                hint2: c.hint2,
                hint3: c.hint3,
                hint1Penalty: c.hint1Penalty,
                hint2Penalty: c.hint2Penalty,
                hint3Penalty: c.hint3Penalty,
            }))
        };
    }

    async solveChallenge(userId: string, eventId: string, challengeId: string, password: string) {
        const membership = await this.prisma.teamMember.findFirst({
            where: { userId, team: { eventId } },
            include: { team: { include: { progress: true } } },
        });

        if (!membership) throw new NotFoundException('Team not found');
        const team = membership.team;

        // Check if already solved
        const existingInteraction = await this.prisma.challengeInteraction.findFirst({
            where: {
                teamId: team.id,
                challengeId: challengeId,
                solved: true
            }
        });

        if (existingInteraction) {
            return { success: true, message: 'Already solved' };
        }

        // Verify Password using AI Service
        const isCorrect = await this.aiService.verifyAnswer(challengeId, password);

        // Log Interaction
        await this.prisma.challengeInteraction.create({
            data: {
                teamId: team.id,
                challengeId: challengeId,
                solved: isCorrect,
                input: password,
                solvedAt: isCorrect ? new Date() : null,
            },
        });

        if (!isCorrect) {
            return { success: false, message: 'Incorrect password' };
        }

        // Calculate Points with hint penalty
        const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
        let points = challenge.points;

        // Check if team used any hints and deduct penalties
        const hintsUsed = await this.prisma.hintUsage.findMany({
            where: {
                teamId: team.id,
                challengeId: challengeId,
            },
        });

        let totalPenalty = 0;
        for (const hint of hintsUsed) {
            if (hint.hintNumber === 1 && challenge.hint1Penalty) {
                totalPenalty += challenge.hint1Penalty;
            } else if (hint.hintNumber === 2 && challenge.hint2Penalty) {
                totalPenalty += challenge.hint2Penalty;
            } else if (hint.hintNumber === 3 && challenge.hint3Penalty) {
                totalPenalty += challenge.hint3Penalty;
            }
        }

        // Ensure points don't go negative
        points = Math.max(0, points - totalPenalty);

        // Update Team Progress
        await this.prisma.teamProgress.update({
            where: { teamId: team.id },
            data: {
                totalPoints: { increment: points },
                lastUpdateTime: new Date(),
            },
        });

        // Broadcast Update
        const newStandings = await this.leaderboardService.getStandings(eventId);
        this.leaderboardGateway.broadcastUpdate(eventId, newStandings);

        return { success: true, points, penalty: totalPenalty };
    }

    async getHint(userId: string, eventId: string, challengeId: string, hintNumber: number) {
        // Validate hint number
        if (hintNumber < 1 || hintNumber > 3) {
            throw new BadRequestException('Hint number must be between 1 and 3');
        }

        // Get user's team
        const membership = await this.prisma.teamMember.findFirst({
            where: { userId, team: { eventId } },
            include: { team: true },
        });

        if (!membership) throw new NotFoundException('Team not found');
        const team = membership.team;

        // Get challenge with hints
        const challenge = await this.prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) throw new NotFoundException('Challenge not found');

        // Get the hint text based on hint number
        const hintField = `hint${hintNumber}` as 'hint1' | 'hint2' | 'hint3';
        const penaltyField = `hint${hintNumber}Penalty` as 'hint1Penalty' | 'hint2Penalty' | 'hint3Penalty';
        const hintText = challenge[hintField];
        const penalty = challenge[penaltyField] || 0;

        if (!hintText) {
            throw new NotFoundException(`Hint ${hintNumber} not available`);
        }

        // Check if already used
        const existingUsage = await this.prisma.hintUsage.findUnique({
            where: {
                teamId_challengeId_hintNumber: {
                    teamId: team.id,
                    challengeId: challengeId,
                    hintNumber: hintNumber,
                },
            },
        });

        // If not already used, create hint usage record
        if (!existingUsage) {
            await this.prisma.hintUsage.create({
                data: {
                    teamId: team.id,
                    challengeId: challengeId,
                    hintNumber: hintNumber,
                },
            });
        }

        return {
            hint: hintText,
            penalty: penalty,
            alreadyUsed: !!existingUsage,
        };
    }
}
