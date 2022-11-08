import { MessagesController } from './messages.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttachmentsModule } from 'src/attachments/attachments.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { Message, MessageSchema } from './message.schema';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    RoomsModule,
    AuthModule,
    AttachmentsModule,
  ],
})
export class MessagesModule {}
