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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventDto = void 0;
const class_validator_1 = require("class-validator");
let CreateEventDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _registrationStartTime_decorators;
    let _registrationStartTime_initializers = [];
    let _registrationStartTime_extraInitializers = [];
    let _registrationEndTime_decorators;
    let _registrationEndTime_initializers = [];
    let _registrationEndTime_extraInitializers = [];
    let _eventStartTime_decorators;
    let _eventStartTime_initializers = [];
    let _eventStartTime_extraInitializers = [];
    let _eventEndTime_decorators;
    let _eventEndTime_initializers = [];
    let _eventEndTime_extraInitializers = [];
    let _maxTeams_decorators;
    let _maxTeams_initializers = [];
    let _maxTeams_extraInitializers = [];
    let _minTeamSize_decorators;
    let _minTeamSize_initializers = [];
    let _minTeamSize_extraInitializers = [];
    let _maxTeamSize_decorators;
    let _maxTeamSize_initializers = [];
    let _maxTeamSize_extraInitializers = [];
    let _challenges_decorators;
    let _challenges_initializers = [];
    let _challenges_extraInitializers = [];
    return _a = class CreateEventDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.registrationStartTime = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _registrationStartTime_initializers, void 0));
                this.registrationEndTime = (__runInitializers(this, _registrationStartTime_extraInitializers), __runInitializers(this, _registrationEndTime_initializers, void 0));
                this.eventStartTime = (__runInitializers(this, _registrationEndTime_extraInitializers), __runInitializers(this, _eventStartTime_initializers, void 0));
                this.eventEndTime = (__runInitializers(this, _eventStartTime_extraInitializers), __runInitializers(this, _eventEndTime_initializers, void 0));
                this.maxTeams = (__runInitializers(this, _eventEndTime_extraInitializers), __runInitializers(this, _maxTeams_initializers, void 0));
                this.minTeamSize = (__runInitializers(this, _maxTeams_extraInitializers), __runInitializers(this, _minTeamSize_initializers, void 0));
                this.maxTeamSize = (__runInitializers(this, _minTeamSize_extraInitializers), __runInitializers(this, _maxTeamSize_initializers, void 0));
                this.challenges = (__runInitializers(this, _maxTeamSize_extraInitializers), __runInitializers(this, _challenges_initializers, void 0));
                __runInitializers(this, _challenges_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _registrationStartTime_decorators = [(0, class_validator_1.IsDateString)()];
            _registrationEndTime_decorators = [(0, class_validator_1.IsDateString)()];
            _eventStartTime_decorators = [(0, class_validator_1.IsDateString)()];
            _eventEndTime_decorators = [(0, class_validator_1.IsDateString)()];
            _maxTeams_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.IsOptional)()];
            _minTeamSize_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.IsOptional)()];
            _maxTeamSize_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.IsOptional)()];
            _challenges_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _registrationStartTime_decorators, { kind: "field", name: "registrationStartTime", static: false, private: false, access: { has: obj => "registrationStartTime" in obj, get: obj => obj.registrationStartTime, set: (obj, value) => { obj.registrationStartTime = value; } }, metadata: _metadata }, _registrationStartTime_initializers, _registrationStartTime_extraInitializers);
            __esDecorate(null, null, _registrationEndTime_decorators, { kind: "field", name: "registrationEndTime", static: false, private: false, access: { has: obj => "registrationEndTime" in obj, get: obj => obj.registrationEndTime, set: (obj, value) => { obj.registrationEndTime = value; } }, metadata: _metadata }, _registrationEndTime_initializers, _registrationEndTime_extraInitializers);
            __esDecorate(null, null, _eventStartTime_decorators, { kind: "field", name: "eventStartTime", static: false, private: false, access: { has: obj => "eventStartTime" in obj, get: obj => obj.eventStartTime, set: (obj, value) => { obj.eventStartTime = value; } }, metadata: _metadata }, _eventStartTime_initializers, _eventStartTime_extraInitializers);
            __esDecorate(null, null, _eventEndTime_decorators, { kind: "field", name: "eventEndTime", static: false, private: false, access: { has: obj => "eventEndTime" in obj, get: obj => obj.eventEndTime, set: (obj, value) => { obj.eventEndTime = value; } }, metadata: _metadata }, _eventEndTime_initializers, _eventEndTime_extraInitializers);
            __esDecorate(null, null, _maxTeams_decorators, { kind: "field", name: "maxTeams", static: false, private: false, access: { has: obj => "maxTeams" in obj, get: obj => obj.maxTeams, set: (obj, value) => { obj.maxTeams = value; } }, metadata: _metadata }, _maxTeams_initializers, _maxTeams_extraInitializers);
            __esDecorate(null, null, _minTeamSize_decorators, { kind: "field", name: "minTeamSize", static: false, private: false, access: { has: obj => "minTeamSize" in obj, get: obj => obj.minTeamSize, set: (obj, value) => { obj.minTeamSize = value; } }, metadata: _metadata }, _minTeamSize_initializers, _minTeamSize_extraInitializers);
            __esDecorate(null, null, _maxTeamSize_decorators, { kind: "field", name: "maxTeamSize", static: false, private: false, access: { has: obj => "maxTeamSize" in obj, get: obj => obj.maxTeamSize, set: (obj, value) => { obj.maxTeamSize = value; } }, metadata: _metadata }, _maxTeamSize_initializers, _maxTeamSize_extraInitializers);
            __esDecorate(null, null, _challenges_decorators, { kind: "field", name: "challenges", static: false, private: false, access: { has: obj => "challenges" in obj, get: obj => obj.challenges, set: (obj, value) => { obj.challenges = value; } }, metadata: _metadata }, _challenges_initializers, _challenges_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEventDto = CreateEventDto;
