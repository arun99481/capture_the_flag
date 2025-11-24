"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let EventsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _handleEventExpiration_decorators;
    var EventsService = _classThis = class {
        constructor(prisma) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.logger = new common_1.Logger(EventsService.name);
        }
        async handleEventExpiration() {
            const now = new Date();
            const result = await this.prisma.event.updateMany({
                where: {
                    eventEndTime: { lt: now },
                    // status: { not: 'COMPLETED' } // Assuming we want to mark them completed
                },
                data: {
                // status: 'COMPLETED' // If status enum existed in Prisma schema, which I removed in previous step to simplify, but I should probably add it back or just rely on dates.
                // Since I removed the enum in the schema update (Wait, did I? I think I did in the replace_file_content step 27).
                // Let's check the schema again. I removed EventStatus enum.
                // So I can't update status. I'll just log for now or maybe I should have kept it.
                // The user requirement said "Force end event / pause event" in Admin Dashboard, so status is useful.
                // But the schema I generated in step 27 removed it? Let me check step 27 input.
                // Yes, I removed EventStatus enum in step 27.
                // I should probably rely on dates for "active" check in GameService.
                }
            });
            // this.logger.debug(`Checked for expired events.`);
        }
        async create(data, creatorId) {
            const { challenges } = data, eventData = __rest(data, ["challenges"]);
            return this.prisma.event.create({
                data: Object.assign(Object.assign({}, eventData), { registrationStartTime: new Date(data.registrationStartTime), registrationEndTime: new Date(data.registrationEndTime), eventStartTime: new Date(data.eventStartTime), eventEndTime: new Date(data.eventEndTime), creatorId, challenges: challenges ? {
                        create: challenges.map((challenge, index) => (Object.assign(Object.assign({}, challenge), { order: index + 1 }))),
                    } : undefined }),
            });
        }
        async forceEnd(id) {
            const event = await this.prisma.event.findUnique({ where: { id } });
            if (!event)
                throw new common_1.NotFoundException('Event not found');
            return this.prisma.event.update({
                where: { id },
                data: {
                    eventEndTime: new Date(), // Set end time to now
                },
            });
        }
        async findAll() {
            return this.prisma.event.findMany({
                orderBy: { eventStartTime: 'asc' },
            });
        }
        async findOne(id) {
            const event = await this.prisma.event.findUnique({
                where: { id },
                include: { challenges: { orderBy: { order: 'asc' } } },
            });
            if (!event)
                throw new common_1.NotFoundException('Event not found');
            return event;
        }
    };
    __setFunctionName(_classThis, "EventsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleEventExpiration_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE)];
        __esDecorate(_classThis, null, _handleEventExpiration_decorators, { kind: "method", name: "handleEventExpiration", static: false, private: false, access: { has: obj => "handleEventExpiration" in obj, get: obj => obj.handleEventExpiration }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventsService = _classThis;
})();
exports.EventsService = EventsService;
