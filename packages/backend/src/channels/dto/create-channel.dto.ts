// packages/backend/src/channels/dto/create-channel.dto.ts
import { IsString, IsOptional, MinLength, MaxLength, IsIn } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['text', 'voice'])
  type?: string;
}