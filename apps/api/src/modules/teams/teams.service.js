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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let TeamsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TeamsService = _classThis = class {
        constructor(prisma) {
            this.prisma = prisma;
        }
        generateJoinCode() {
            return (0, crypto_1.randomBytes)(4).toString('hex').toUpperCase();
        }
        async create(userId, data) {
            // Check if user is already in a team for this event
            const existingMember = await this.prisma.teamMember.findFirst({
                where: {
                    userId,
                    team: { eventId: data.eventId },
                },
            });
            if (existingMember) {
                throw new common_1.BadRequestException('User already in a team for this event');
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
            }
            catch (error) {
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('Team name already taken');
                }
                throw error;
            }
        }
        async join(userId, joinCode) {
            const team = await this.prisma.team.findUnique({
                where: { joinCode },
                include: { event: true, members: true },
            });
            if (!team)
                throw new common_1.NotFoundException('Invalid join code');
            if (team.members.length >= team.event.maxTeamSize) {
                throw new common_1.BadRequestException('Team is full');
            }
            // Check if user is already in a team for this event
            const existingMember = await this.prisma.teamMember.findFirst({
                where: {
                    userId,
                    team: { eventId: team.eventId },
                },
            });
            if (existingMember) {
                throw new common_1.BadRequestException('User already in a team for this event');
            }
            return this.prisma.teamMember.create({
                data: {
                    teamId: team.id,
                    userId,
                },
            });
        }
        async findMyTeam(userId, eventId) {
            const membership = await this.prisma.teamMember.findFirst({
                where: {
                    userId,
                    team: { eventId },
                },
                include: { team: { include: { members: { include: { user: true } } } } },
            });
            return (membership === null || membership === void 0 ? void 0 : membership.team) || null;
        }
    };
    __setFunctionName(_classThis, "TeamsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TeamsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TeamsService = _classThis;
})();
exports.TeamsService = TeamsService;
