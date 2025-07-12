import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    private messagesService;
    private usersService;
    server: Server;
    private connectedUsers;
    constructor(jwtService: JwtService, prisma: PrismaService, messagesService: MessagesService, usersService: UsersService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleChannelJoin(client: Socket, data: {
        channelId: string;
    }): Promise<void>;
    handleChannelLeave(client: Socket, data: {
        channelId: string;
    }): Promise<void>;
    handleMessageSend(client: Socket, data: {
        channelId: string;
        content: string;
        type?: string;
    }): Promise<void>;
    handleMessageEdit(client: Socket, data: {
        messageId: string;
        content: string;
    }): Promise<void>;
    handleMessageDelete(client: Socket, data: {
        messageId: string;
    }): Promise<void>;
    handleTypingStart(client: Socket, data: {
        channelId: string;
    }): Promise<void>;
    handleTypingStop(client: Socket, data: {
        channelId: string;
    }): Promise<void>;
}
