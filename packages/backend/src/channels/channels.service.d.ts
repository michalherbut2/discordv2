import { PrismaService } from '../../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
export declare class ChannelsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(serverId: string, createChannelDto: CreateChannelDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }>;
    findByServerId(serverId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }[]>;
    findById(id: string): Promise<{
        server: {
            id: string;
            name: string;
            ownerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }>;
    update(id: string, updateChannelDto: UpdateChannelDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }>;
}
