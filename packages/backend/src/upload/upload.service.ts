// packages/backend/src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async saveFile(file: Express.Multer.File, uploaderId: string) {
    const fileRecord = await this.prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        uploaderId,
      },
    });

    return fileRecord;
  }

  async getFile(id: string) {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }
}
