import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            status: string;
        };
        tokens: import("./auth.service").TokenResponse;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            status: string;
        };
        tokens: import("./auth.service").TokenResponse;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            status: string;
        };
        tokens: import("./auth.service").TokenResponse;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        id: any;
        email: any;
        username: any;
        avatar: any;
        status: any;
    }>;
}
