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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ChannelsService = class ChannelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(serverId, createChannelDto, userId) {
        const member = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });
        if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
            throw new common_1.ForbiddenException('Only server admins and owners can create channels');
        }
        const channelCount = await this.prisma.channel.count({
            where: { serverId },
        });
        return this.prisma.channel.create({
            data: {
                ...createChannelDto,
                serverId,
                position: channelCount,
            },
        });
    }
    async findByServerId(serverId) {
        return this.prisma.channel.findMany({
            where: { serverId },
            orderBy: { position: 'asc' },
        });
    }
    async findById(id) {
        const channel = await this.prisma.channel.findUnique({
            where: { id },
            include: {
                server: {
                    select: {
                        id: true,
                        name: true,
                        ownerId: true,
                    },
                },
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        return channel;
    }
    async update(id, updateChannelDto, userId) {
        const channel = await this.findById(id);
        const member = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId: channel.serverId,
                },
            },
        });
        if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
            throw new common_1.ForbiddenException('Only server admins and owners can update channels');
        }
        return this.prisma.channel.update({
            where: { id },
            data: updateChannelDto,
        });
    }
    async delete(id, userId) {
        const channel = await this.findById(id);
        const member = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId: channel.serverId,
                },
            },
        });
        if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
            throw new common_1.ForbiddenException('Only server admins and owners can delete channels');
        }
        return this.prisma.channel.delete({
            where: { id },
        });
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map