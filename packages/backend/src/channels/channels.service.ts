// packages/backend/src/channels/channels.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(
    serverId: string,
    createChannelDto: CreateChannelDto,
    userId: string,
  ) {
    // Check if user is server member with admin/owner permissions
    const member = await this.prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId,
        },
      },
    });

    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      throw new ForbiddenException(
        'Only server admins and owners can create channels',
      );
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

  async findByServerId(serverId: string) {
    return this.prisma.channel.findMany({
      where: { serverId },
      orderBy: { position: 'asc' },
    });
  }

  async findById(id: string) {
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
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto, userId: string) {
    const channel = await this.findById(id);

    // Check if user has permission to update channel
    const member = await this.prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: channel.serverId,
        },
      },
    });

    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      throw new ForbiddenException(
        'Only server admins and owners can update channels',
      );
    }

    return this.prisma.channel.update({
      where: { id },
      data: updateChannelDto,
    });
  }

  async delete(id: string, userId: string) {
    const channel = await this.findById(id);

    // Check if user has permission to delete channel
    const member = await this.prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId: channel.serverId,
        },
      },
    });

    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      throw new ForbiddenException(
        'Only server admins and owners can delete channels',
      );
    }

    return this.prisma.channel.delete({
      where: { id },
    });
  }
}
