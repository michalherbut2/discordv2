import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(channelId: string, createMessageDto: CreateMessageDto, authorId: string): Promise<{
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
    findByChannelId(channelId: string, page?: number, limit?: number): Promise<({
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
    findById(id: string): Promise<{
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
    update(id: string, updateMessageDto: UpdateMessageDto, userId: string): Promise<{
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
    delete(id: string, userId: string): Promise<{
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
