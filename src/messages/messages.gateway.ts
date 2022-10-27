import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway(80, {
  namespace: 'messages',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  private clients = {};

  constructor(
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
    private readonly rommsService: RoomsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const accessToken = client.handshake?.headers?.authorization?.split(' ')[1];
    console.log('accessToken: ', accessToken);
    const fromUser = await this.authService.verifyToken(accessToken);
    console.log('fromUser: ', fromUser);
    if (!fromUser) client.disconnect();
    else {
      client.join(fromUser.id);
      this.clients[client.id] = fromUser._id;
      console.log('client: ', this.clients);
      client.emit('general', {
        message: 'Connected!',
      });
    }
  }

  handleDisconnect(client: Socket): void {
    delete this.clients[client.id];
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    // this.server.emit('message', message);
    console.log('on message11: ', message);
  }

  @SubscribeMessage('send')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const newMessage = await this.messagesService.create(createMessageDto);
    // this.server.to(createMessageDto.)
    const room = await this.rommsService.findOne(createMessageDto.roomId);
    const id = room.members.map((item) => item.toString());
    // room.members
    //   .map((item) => item.toString())
    //   .filter((item) => item !== newMessage.senderId.toString())
    //   .at(0);
    console.log('sent: ', id);
    this.server.to(id).emit('sent', newMessage, (res) => {
      console.log('res: ', res);
    });
    return newMessage;
  }
}
