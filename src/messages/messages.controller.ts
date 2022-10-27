import { Body, Controller, Post } from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }
}
