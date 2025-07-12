import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export interface TokenPayload {
    sub: string;
    email: string;
    username: string;
    iat?: number;
    exp?: number;
}
export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            status: string;
        };
        tokens: TokenResponse;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            status: string;
        };
        tokens: TokenResponse;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            status: string;
        };
        tokens: TokenResponse;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    validateUser(payload: TokenPayload): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateTokens;
}
