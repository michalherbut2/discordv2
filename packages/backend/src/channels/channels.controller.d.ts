import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
export declare class ChannelsController {
    private channelsService;
    constructor(channelsService: ChannelsService);
    create(serverId: string, createChannelDto: CreateChannelDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }>;
    findByServer(serverId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }[]>;
}
export declare class ChannelController {
    private channelsService;
    constructor(channelsService: ChannelsService);
    findOne(id: string): Promise<{
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
    update(id: string, updateChannelDto: UpdateChannelDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        serverId: string;
        position: number;
    }>;
    remove(id: string, user: any): Promise<{
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
