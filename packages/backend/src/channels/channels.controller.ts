// packages/backend/src/channels/channels.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('servers/:serverId/channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Post()
  create(
    @Param('serverId') serverId: string,
    @Body() createChannelDto: CreateChannelDto,
    @CurrentUser() user: any,
  ) {
    return this.channelsService.create(serverId, createChannelDto, user.id);
  }

  @Get()
  findByServer(@Param('serverId') serverId: string) {
    return this.channelsService.findByServerId(serverId);
  }
}

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private channelsService: ChannelsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @CurrentUser() user: any,
  ) {
    return this.channelsService.update(id, updateChannelDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelsService.delete(id, user.id);
  }
}