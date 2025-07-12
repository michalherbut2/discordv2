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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const messages_service_1 = require("../messages/messages.service");
const users_service_1 = require("../users/users.service");
const helpers_1 = require("../common/helpers");
let ChatGateway = class ChatGateway {
    jwtService;
    prisma;
    messagesService;
    usersService;
    server;
    connectedUsers = new Map();
    constructor(jwtService, prisma, messagesService, usersService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.messagesService = messagesService;
        this.usersService = usersService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            this.connectedUsers.set(client.id, userId);
            await this.usersService.updateStatus(userId, 'online');
            const userServers = await this.prisma.server.findMany({
                where: {
                    members: {
                        some: { userId },
                    },
                },
                include: {
                    channels: true,
                },
            });
            userServers.forEach((server) => {
                server.channels.forEach((channel) => {
                    client.join(`channel:${channel.id}`);
                });
            });
            this.server.emit('user:status', {
                userId,
                status: 'online',
            });
            console.log(`User ${userId} connected`);
        }
        catch (error) {
            console.error('Authentication failed:', error);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const userId = this.connectedUsers.get(client.id);
        if (userId) {
            await this.usersService.updateStatus(userId, 'offline');
            this.server.emit('user:status', {
                userId,
                status: 'offline',
            });
            this.connectedUsers.delete(client.id);
            console.log(`User ${userId} disconnected`);
        }
    }
    async handleChannelJoin(client, data) {
        client.join(`channel:${data.channelId}`);
        console.log(`User joined channel: ${data.channelId}`);
    }
    async handleChannelLeave(client, data) {
        client.leave(`channel:${data.channelId}`);
        console.log(`User left channel: ${data.channelId}`);
    }
    async handleMessageSend(client, data) {
        try {
            const userId = this.connectedUsers.get(client.id);
            if (!userId)
                return;
            const message = await this.messagesService.create(data.channelId, {
                content: data.content,
                type: data.type || 'text',
            }, userId);
            this.server.to(`channel:${data.channelId}`).emit('message:new', message);
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async handleMessageEdit(client, data) {
        try {
            const userId = this.connectedUsers.get(client.id);
            if (!userId)
                return;
            const message = await this.messagesService.update(data.messageId, { content: data.content }, userId);
            const channelId = message.channelId;
            this.server.to(`channel:${channelId}`).emit('message:updated', message);
        }
        catch (error) {
            (0, helpers_1.handleSocketError)(error, client);
        }
    }
    async handleMessageDelete(client, data) {
        try {
            const userId = this.connectedUsers.get(client.id);
            if (!userId)
                return;
            const message = await this.messagesService.findById(data.messageId);
            const channelId = message.channelId;
            await this.messagesService.delete(data.messageId, userId);
            this.server.to(`channel:${channelId}`).emit('message:deleted', {
                messageId: data.messageId,
                channelId,
            });
        }
        catch (error) {
            (0, helpers_1.handleSocketError)(error, client);
        }
    }
    async handleTypingStart(client, data) {
        const userId = this.connectedUsers.get(client.id);
        if (!userId)
            return;
        client.to(`channel:${data.channelId}`).emit('typing:start', {
            userId,
            channelId: data.channelId,
        });
    }
    async handleTypingStop(client, data) {
        const userId = this.connectedUsers.get(client.id);
        if (!userId)
            return;
        client.to(`channel:${data.channelId}`).emit('typing:stop', {
            userId,
            channelId: data.channelId,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('channel:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleChannelJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('channel:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleChannelLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageSend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:edit'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageEdit", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:delete'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageDelete", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStop", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        messages_service_1.MessagesService,
        users_service_1.UsersService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map