// packages/backend/src/messages/messages.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('channels/:channelId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  create(
    @Param('channelId') channelId: string,
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.create(channelId, createMessageDto, user.id);
  }

  @Get()
  findByChannel(
    @Param('channelId') channelId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    return this.messagesService.findByChannelId(
      channelId,
      parseInt(page),
      parseInt(limit),
    );
  }
}

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private messagesService: MessagesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.update(id, updateMessageDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.delete(id, user.id);
  }
}