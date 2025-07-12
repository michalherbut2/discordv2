import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
export declare class ServersController {
    private serversService;
    constructor(serversService: ServersService);
    create(createServerDto: CreateServerDto, user: any): Promise<{
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
    findUserServers(user: any): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, updateServerDto: UpdateServerDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        ownerId: string;
    }>;
    joinServer(id: string, user: any): Promise<{
        id: string;
        role: string;
        joinedAt: Date;
        userId: string;
        serverId: string;
    }>;
    leaveServer(id: string, user: any): Promise<{
        id: string;
        role: string;
        joinedAt: Date;
        userId: string;
        serverId: string;
    }>;
}
