// packages/backend/src/messages/messages.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(
    channelId: string,
    createMessageDto: CreateMessageDto,
    authorId: string,
  ) {
    // Check if user is member of the server
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
      throw new NotFoundException('Channel not found');
    }

    if (channel.server.members.length === 0) {
      throw new ForbiddenException('You are not a member of this server');
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

  async findByChannelId(
    channelId: string,
    page: number = 1,
    limit: number = 50,
  ) {
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

    return messages.reverse(); // Return in ascending order
  }

  async findById(id: string) {
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
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string) {
    const message = await this.findById(id);

    if (message.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
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

  async delete(id: string, userId: string) {
    const message = await this.findById(id);

    // Check if user is message author or server admin/owner
    const isAuthor = message.authorId === userId;
    const isServerAdmin = message.channel.server.members.some(
      (member) =>
        member.userId === userId &&
        (member.role === 'admin' || member.role === 'owner'),
    );

    if (!isAuthor && !isServerAdmin) {
      throw new ForbiddenException(
        'You can only delete your own messages or be a server admin',
      );
    }

    return this.prisma.message.delete({
      where: { id },
    });
  }
}
