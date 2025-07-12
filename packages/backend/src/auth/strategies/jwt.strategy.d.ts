import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, TokenPayload } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: TokenPayload): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
