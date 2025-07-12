// // packages/backend/src/auth/dto/register.dto.ts
// import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

// export class RegisterDto {
//   @IsEmail()
//   email: string;

//   @IsString()
//   @MinLength(2)
//   @MaxLength(32)
//   username: string;

//   @IsString()
//   @MinLength(6)
//   @MaxLength(100)
//   password: string;
// }

// packages/backend/src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}



