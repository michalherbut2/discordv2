import { PrismaService } from '../../prisma/prisma.service';
export declare class UploadService {
    private prisma;
    constructor(prisma: PrismaService);
    saveFile(file: Express.Multer.File, uploaderId: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploaderId: string;
    }>;
    getFile(id: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploaderId: string;
    } | null>;
}
