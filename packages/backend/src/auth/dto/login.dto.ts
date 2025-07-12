// // packages/backend/src/auth/dto/login.dto.ts
// import { IsEmail, IsString } from 'class-validator';

// export class LoginDto {
//   @IsEmail()
//   email: string;

//   @IsString()
//   password: string;
// }

// packages/backend/src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password is required' })
  password: string;
}