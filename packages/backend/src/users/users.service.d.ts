import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        username: string;
        password: string;
        avatar: string | null;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
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
