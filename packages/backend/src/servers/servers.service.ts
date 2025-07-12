// packages/backend/src/servers/servers.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
  constructor(private prisma: PrismaService) {}

  async create(createServerDto: CreateServerDto, ownerId: string) {
    const server = await this.prisma.server.create({
      data: {
        ...createServerDto,
        ownerId,
      },
    });

    // Add owner as a member
    await this.prisma.serverMember.create({
      data: {
        userId: ownerId,
        serverId: server.id,
        role: 'owner',
      },
    });

    // Create default channel
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

  async findUserServers(userId: string) {
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

  async findById(id: string) {
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
      throw new NotFoundException('Server not found');
    }

    return server;
  }

  async update(id: string, updateServerDto: UpdateServerDto, userId: string) {
    const server = await this.findById(id);

    if (server.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the server owner can update the server',
      );
    }

    return this.prisma.server.update({
      where: { id },
      data: updateServerDto,
    });
  }

  async delete(id: string, userId: string) {
    const server = await this.findById(id);

    if (server.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the server owner can delete the server',
      );
    }

    return this.prisma.server.delete({
      where: { id },
    });
  }

  async joinServer(serverId: string, userId: string) {
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
      throw new ForbiddenException('User is already a member of this server');
    }

    return this.prisma.serverMember.create({
      data: {
        userId,
        serverId,
        role: 'member',
      },
    });
  }

  async leaveServer(serverId: string, userId: string) {
    const server = await this.findById(serverId);

    if (server.ownerId === userId) {
      throw new ForbiddenException('Server owner cannot leave the server');
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
}
