import { UploadService } from './upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, user: any): Promise<{
        id: string;
        url: string;
        filename: string;
        originalName: string;
        size: number;
    }>;
    uploadFile(file: Express.Multer.File, user: any): Promise<{
        id: string;
        url: string;
        filename: string;
        originalName: string;
        size: number;
    }>;
}
