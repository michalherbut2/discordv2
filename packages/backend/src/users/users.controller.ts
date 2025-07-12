// packages/backend/src/users/users.controller.ts
import { Controller, Get, Put, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      status: user.status,
    };
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      status: updatedUser.status,
    };
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = `/uploads/${file.filename}`;
    const updatedUser = await this.usersService.update(user.id, { avatar: avatarUrl });
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      status: updatedUser.status,
    };
  }
}