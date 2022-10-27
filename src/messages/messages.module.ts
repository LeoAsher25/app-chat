import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MessagesGateway } from './messages.gateway';
import { Message, MessageSchema } from './messages.schema';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesGateway, MessagesService],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    RoomsModule,
    AuthModule,
  ],
})
export class MessagesModule {}
