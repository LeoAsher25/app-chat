import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { Room, RoomSchema } from 'src/rooms/room.schema';
import { MessagesGateway } from './messages.gateway';
import { Message, MessageSchema } from './message.schema';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesGateway, MessagesService],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    RoomsModule,
    AuthModule,
  ],
})
export class MessagesModule {}
