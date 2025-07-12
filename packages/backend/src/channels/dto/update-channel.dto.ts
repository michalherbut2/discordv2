// packages/backend/src/channels/dto/update-channel.dto.ts
import { IsOptional, IsString, MinLength, MaxLength, IsIn } from 'class-validator';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['text', 'voice'])
  type?: string;
}