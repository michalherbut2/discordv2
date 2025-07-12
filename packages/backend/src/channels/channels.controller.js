"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelController = exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const update_channel_dto_1 = require("./dto/update-channel.dto");
let ChannelsController = class ChannelsController {
    channelsService;
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    create(serverId, createChannelDto, user) {
        return this.channelsService.create(serverId, createChannelDto, user.id);
    }
    findByServer(serverId) {
        return this.channelsService.findByServerId(serverId);
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_channel_dto_1.CreateChannelDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "findByServer", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, common_1.Controller)('servers/:serverId/channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
let ChannelController = class ChannelController {
    channelsService;
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    findOne(id) {
        return this.channelsService.findById(id);
    }
    update(id, updateChannelDto, user) {
        return this.channelsService.update(id, updateChannelDto, user.id);
    }
    remove(id, user) {
        return this.channelsService.delete(id, user.id);
    }
};
exports.ChannelController = ChannelController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChannelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_channel_dto_1.UpdateChannelDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChannelController.prototype, "remove", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelController);
//# sourceMappingURL=channels.controller.js.map