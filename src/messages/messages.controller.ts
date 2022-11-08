import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  get(@Query('room') roomId: string) {
    return this.messagesService.getMessageByRoomId(roomId);
  }
}
