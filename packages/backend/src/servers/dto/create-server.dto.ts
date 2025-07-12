// packages/backend/src/servers/dto/create-server.dto.ts
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateServerDto {
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
  type?: string;
}