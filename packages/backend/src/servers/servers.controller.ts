// packages/backend/src/servers/servers.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServersService } from './servers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Controller('servers')
@UseGuards(JwtAuthGuard)
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Post()
  create(@Body() createServerDto: CreateServerDto, @CurrentUser() user: any) {
    return this.serversService.create(createServerDto, user.id);
  }

  @Get()
  findUserServers(@CurrentUser() user: any) {
    return this.serversService.findUserServers(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
    @CurrentUser() user: any,
  ) {
    return this.serversService.update(id, updateServerDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.serversService.delete(id, user.id);
  }

  @Post(':id/join')
  joinServer(@Param('id') id: string, @CurrentUser() user: any) {
    return this.serversService.joinServer(id, user.id);
  }

  @Post(':id/leave')
  leaveServer(@Param('id') id: string, @CurrentUser() user: any) {
    return this.serversService.leaveServer(id, user.id);
  }
}