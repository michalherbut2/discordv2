import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
        id: any;
        email: any;
        username: any;
        avatar: any;
        status: any;
    }>;
    updateProfile(user: any, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        username: string;
        avatar: string | null;
        status: string;
    }>;
    updateAvatar(user: any, file: Express.Multer.File): Promise<{
        id: string;
        email: string;
        username: string;
        avatar: string | null;
        status: string;
    }>;
}
