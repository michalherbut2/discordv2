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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(channelId, createMessageDto, authorId) {
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
            include: {
                server: {
                    include: {
                        members: {
                            where: { userId: authorId },
                        },
                    },
                },
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        if (channel.server.members.length === 0) {
            throw new common_1.ForbiddenException('You are not a member of this server');
        }
        return this.prisma.message.create({
            data: {
                ...createMessageDto,
                channelId,
                authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async findByChannelId(channelId, page = 1, limit = 50) {
        const messages = await this.prisma.message.findMany({
            where: { channelId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return messages.reverse();
    }
    async findById(id) {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                channel: {
                    include: {
                        server: {
                            include: {
                                members: true,
                            },
                        },
                    },
                },
            },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        return message;
    }
    async update(id, updateMessageDto, userId) {
        const message = await this.findById(id);
        if (message.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own messages');
        }
        return this.prisma.message.update({
            where: { id },
            data: {
                ...updateMessageDto,
                edited: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async delete(id, userId) {
        const message = await this.findById(id);
        const isAuthor = message.authorId === userId;
        const isServerAdmin = message.channel.server.members.some((member) => member.userId === userId &&
            (member.role === 'admin' || member.role === 'owner'));
        if (!isAuthor && !isServerAdmin) {
            throw new common_1.ForbiddenException('You can only delete your own messages or be a server admin');
        }
        return this.prisma.message.delete({
            where: { id },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map