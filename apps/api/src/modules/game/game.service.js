"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GameService = _classThis = class {
        constructor(prisma, aiService, leaderboardGateway, leaderboardService) {
            this.prisma = prisma;
            this.aiService = aiService;
            this.leaderboardGateway = leaderboardGateway;
            this.leaderboardService = leaderboardService;
        }
        async getStatus(userId, eventId) {
            var _a;
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
            if (!membership)
                throw new common_1.NotFoundException('You are not in a team for this event');
            const team = membership.team;
            const solvedChallengeIds = team.interactions
                .filter(i => i.solved)
                .map(i => i.challengeId);
            return {
                team: {
                    id: team.id,
                    name: team.name,
                    points: ((_a = team.progress) === null || _a === void 0 ? void 0 : _a.totalPoints) || 0,
                },
                eventEndTime: team.event.eventEndTime,
                challenges: team.event.challenges.map(c => ({
                    id: c.id,
                    type: c.type,
                    title: c.title,
                    description: c.description,
                    points: c.points,
                    difficulty: c.difficulty,
                    order: c.order,
                    status: solvedChallengeIds.includes(c.id) ? 'SOLVED' : 'OPEN',
                    // Chat-specific
                    systemPrompt: c.systemPrompt,
                    // Hint fields (both types)
                    hint1: c.hint1,
                    hint2: c.hint2,
                    hint3: c.hint3,
                    hint1Penalty: c.hint1Penalty,
                    hint2Penalty: c.hint2Penalty,
                    hint3Penalty: c.hint3Penalty,
                    // Simulation-specific
                    websiteTheme: c.websiteTheme,
                    module1Name: c.module1Name,
                    module1Content: c.module1Content,
                    module2Name: c.module2Name,
                    module2Content: c.module2Content,
                    module3Name: c.module3Name,
                    module3Content: c.module3Content,
                    lockedModuleIndex: c.lockedModuleIndex,
                    lockedModuleMsg: c.lockedModuleMsg,
                    chatbotPrompt: c.chatbotPrompt,
                }))
            };
        }
        async solveChallenge(userId, eventId, challengeId, password) {
            const membership = await this.prisma.teamMember.findFirst({
                where: { userId, team: { eventId } },
                include: { team: { include: { progress: true } } },
            });
            if (!membership)
                throw new common_1.NotFoundException('Team not found');
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
                }
                else if (hint.hintNumber === 2 && challenge.hint2Penalty) {
                    totalPenalty += challenge.hint2Penalty;
                }
                else if (hint.hintNumber === 3 && challenge.hint3Penalty) {
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
        async getHint(userId, eventId, challengeId, hintNumber) {
            // Validate hint number
            if (hintNumber < 1 || hintNumber > 3) {
                throw new common_1.BadRequestException('Hint number must be between 1 and 3');
            }
            // Get user's team
            const membership = await this.prisma.teamMember.findFirst({
                where: { userId, team: { eventId } },
                include: { team: true },
            });
            if (!membership)
                throw new common_1.NotFoundException('Team not found');
            const team = membership.team;
            // Get challenge with hints
            const challenge = await this.prisma.challenge.findUnique({
                where: { id: challengeId },
            });
            if (!challenge)
                throw new common_1.NotFoundException('Challenge not found');
            // Get the hint text based on hint number
            const hintField = `hint${hintNumber}`;
            const penaltyField = `hint${hintNumber}Penalty`;
            const hintText = challenge[hintField];
            const penalty = challenge[penaltyField] || 0;
            if (!hintText) {
                throw new common_1.NotFoundException(`Hint ${hintNumber} not available`);
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
    };
    __setFunctionName(_classThis, "GameService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameService = _classThis;
})();
exports.GameService = GameService;
