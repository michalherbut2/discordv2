import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    create(channelId: string, createMessageDto: CreateMessageDto, user: any): Promise<{
        author: {
            username: string;
            avatar: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        edited: boolean;
        authorId: string;
        channelId: string;
    }>;
    findByChannel(channelId: string, page?: string, limit?: string): Promise<({
        author: {
            username: string;
            avatar: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        edited: boolean;
        authorId: string;
        channelId: string;
    })[]>;
}
export declare class MessageController {
    private messagesService;
    constructor(messagesService: MessagesService);
    findOne(id: string): Promise<{
        channel: {
            server: {
                members: {
                    id: string;
                    role: string;
                    joinedAt: Date;
                    userId: string;
                    serverId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                icon: string | null;
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
        };
        author: {
            username: string;
            avatar: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        edited: boolean;
        authorId: string;
        channelId: string;
    }>;
    update(id: string, updateMessageDto: UpdateMessageDto, user: any): Promise<{
        author: {
            username: string;
            avatar: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        edited: boolean;
        authorId: string;
        channelId: string;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        edited: boolean;
        authorId: string;
        channelId: string;
    }>;
}
