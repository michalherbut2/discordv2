import { PrismaService } from '../../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
export declare class ServersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServerDto: CreateServerDto, ownerId: string): Promise<{
        owner: {
            username: string;
            avatar: string | null;
            id: string;
        };
        members: {
            user: {
                username: string;
                avatar: string | null;
                status: string;
                id: string;
            };
            id: string;
            role: string;
            userId: string;
        }[];
        channels: {
            id: string;
            name: string;
            type: string;
            position: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    }>;
    findUserServers(userId: string): Promise<({
        owner: {
            username: string;
            avatar: string | null;
            id: string;
        };
        members: {
            user: {
                username: string;
                avatar: string | null;
                status: string;
                id: string;
            };
            id: string;
            role: string;
            userId: string;
        }[];
        channels: {
            id: string;
            name: string;
            type: string;
            position: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    })[]>;
    findById(id: string): Promise<{
        owner: {
            username: string;
            avatar: string | null;
            id: string;
        };
        members: {
            user: {
                username: string;
                avatar: string | null;
                status: string;
                id: string;
            };
            id: string;
            role: string;
            userId: string;
        }[];
        channels: {
            id: string;
            name: string;
            type: string;
            position: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    }>;
    update(id: string, updateServerDto: UpdateServerDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    }>;
    joinServer(serverId: string, userId: string): Promise<{
        id: string;
        role: string;
        joinedAt: Date;
        userId: string;
        serverId: string;
    }>;
    leaveServer(serverId: string, userId: string): Promise<{
        id: string;
        role: string;
        joinedAt: Date;
        userId: string;
        serverId: string;
    }>;
}
