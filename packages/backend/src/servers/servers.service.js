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
exports.ServersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ServersService = class ServersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServerDto, ownerId) {
        const server = await this.prisma.server.create({
            data: {
                ...createServerDto,
                ownerId,
            },
        });
        await this.prisma.serverMember.create({
            data: {
                userId: ownerId,
                serverId: server.id,
                role: 'owner',
            },
        });
        await this.prisma.channel.create({
            data: {
                name: 'general',
                serverId: server.id,
                type: 'text',
                position: 0,
            },
        });
        return this.findById(server.id);
    }
    async findUserServers(userId) {
        return this.prisma.server.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        role: true,
                        userId: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                                status: true,
                            },
                        },
                    },
                },
                channels: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        position: true,
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
    }
    async findById(id) {
        const server = await this.prisma.server.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        role: true,
                        userId: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                                status: true,
                            },
                        },
                    },
                },
                channels: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        position: true,
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
        if (!server) {
            throw new common_1.NotFoundException('Server not found');
        }
        return server;
    }
    async update(id, updateServerDto, userId) {
        const server = await this.findById(id);
        if (server.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only the server owner can update the server');
        }
        return this.prisma.server.update({
            where: { id },
            data: updateServerDto,
        });
    }
    async delete(id, userId) {
        const server = await this.findById(id);
        if (server.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only the server owner can delete the server');
        }
        return this.prisma.server.delete({
            where: { id },
        });
    }
    async joinServer(serverId, userId) {
        const server = await this.findById(serverId);
        const existingMember = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });
        if (existingMember) {
            throw new common_1.ForbiddenException('User is already a member of this server');
        }
        return this.prisma.serverMember.create({
            data: {
                userId,
                serverId,
                role: 'member',
            },
        });
    }
    async leaveServer(serverId, userId) {
        const server = await this.findById(serverId);
        if (server.ownerId === userId) {
            throw new common_1.ForbiddenException('Server owner cannot leave the server');
        }
        return this.prisma.serverMember.delete({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });
    }
};
exports.ServersService = ServersService;
exports.ServersService = ServersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServersService);
//# sourceMappingURL=servers.service.js.map