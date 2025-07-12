// packages/backend/src/messages/dto/create-message.dto.ts
import { IsString, IsOptional, MinLength, MaxLength, IsIn, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  @IsIn(['text', 'image', 'file'])
  type?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}