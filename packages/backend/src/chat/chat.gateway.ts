// packages/backend/src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
import { handleSocketError } from '../common/helpers';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private messagesService: MessagesService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store user connection
      this.connectedUsers.set(client.id, userId);

      // Update user status to online
      await this.usersService.updateStatus(userId, 'online');

      // Join user to their server channels
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

      // Notify other users about status change
      this.server.emit('user:status', {
        userId,
        status: 'online',
      });

      console.log(`User ${userId} connected`);
    } catch (error) {
      console.error('Authentication failed:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      // Update user status to offline
      await this.usersService.updateStatus(userId, 'offline');

      // Notify other users about status change
      this.server.emit('user:status', {
        userId,
        status: 'offline',
      });

      this.connectedUsers.delete(client.id);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('channel:join')
  async handleChannelJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    client.join(`channel:${data.channelId}`);
    console.log(`User joined channel: ${data.channelId}`);
  }

  @SubscribeMessage('channel:leave')
  async handleChannelLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    client.leave(`channel:${data.channelId}`);
    console.log(`User left channel: ${data.channelId}`);
  }

  @SubscribeMessage('message:send')
  async handleMessageSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; content: string; type?: string },
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) return;

      const message = await this.messagesService.create(
        data.channelId,
        {
          content: data.content,
          type: data.type || 'text',
        },
        userId,
      );

      // Emit to all users in the channel
      this.server.to(`channel:${data.channelId}`).emit('message:new', message);
    } catch (error) {
      client.emit('error', { message: (error as Error).message });
    }
  }

  @SubscribeMessage('message:edit')
  async handleMessageEdit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; content: string },
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) return;

      const message = await this.messagesService.update(
        data.messageId,
        { content: data.content },
        userId,
      );

      const channelId = message.channelId;
      this.server.to(`channel:${channelId}`).emit('message:updated', message);
    } catch (error) {
      // client.emit('error', { message: error.message });
      handleSocketError(error, client);
    }
  }

  @SubscribeMessage('message:delete')
  async handleMessageDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) return;

      const message = await this.messagesService.findById(data.messageId);
      const channelId = message.channelId;

      await this.messagesService.delete(data.messageId, userId);

      this.server.to(`channel:${channelId}`).emit('message:deleted', {
        messageId: data.messageId,
        channelId,
      });
    } catch (error) {
      // client.emit('error', { message: error.message });
      handleSocketError(error, client);
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    client.to(`channel:${data.channelId}`).emit('typing:start', {
      userId,
      channelId: data.channelId,
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    client.to(`channel:${data.channelId}`).emit('typing:stop', {
      userId,
      channelId: data.channelId,
    });
  }
}
