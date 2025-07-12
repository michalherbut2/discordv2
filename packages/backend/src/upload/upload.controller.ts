// packages/backend/src/upload/upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        cb(new BadRequestException('Only image files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileRecord = await this.uploadService.saveFile(file, user.id);
    return {
      id: fileRecord.id,
      url: fileRecord.url,
      filename: fileRecord.filename,
      originalName: fileRecord.originalName,
      size: fileRecord.size,
    };
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 25 * 1024 * 1024, // 25MB
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileRecord = await this.uploadService.saveFile(file, user.id);
    return {
      id: fileRecord.id,
      url: fileRecord.url,
      filename: fileRecord.filename,
      originalName: fileRecord.originalName,
      size: fileRecord.size,
    };
  }
}