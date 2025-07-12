// packages/backend/src/servers/dto/update-server.dto.ts
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateServerDto {
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
  type?: string;
}