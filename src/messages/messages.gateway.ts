import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { AuthService } from 'src/auth/auth.service';
import { AllExceptionsFilter } from 'src/common/decorators/filters/WsExceptionFilter';
import isJsonObject from 'src/common/utils/isJsonObject';
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
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const accessToken = client.handshake?.headers?.authorization?.split(' ')[1];
    const fromUser = await this.authService.verifyToken(accessToken);
    if (!fromUser) {
      client.emit('general', {
        message: 'Unauthorization!',
      });
      client.disconnect();
    } else {
      client.join(fromUser._id);
      this.clients[client.id] = fromUser._id;
      client.emit('general', {
        message: 'Connected!',
      });
    }
  }

  handleDisconnect(client: Socket): void {
    delete this.clients[client.id];
  }

  @UseFilters(new AllExceptionsFilter())
  @SubscribeMessage('send')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto | string,
  ) {
    const accessToken = client.handshake?.headers?.authorization?.split(' ')[1];
    const fromUser = await this.authService.verifyToken(accessToken);
    let attachments = [];
    if (
      (createMessageDto as CreateMessageDto).attachments &&
      (createMessageDto as CreateMessageDto).attachments?.length > 0
    ) {
      attachments = await this.attachmentsService.find(
        {
          _id: {
            $in: (createMessageDto as CreateMessageDto).attachments,
          },
        },
        {
          _id: 1,
          filename: 1,
          size: 1,
        },
      );

      if (attachments.length === 0) {
        throw new WsException({
          error: 'Bad Request',
          message: "Attchment's Id not found",
        });
      }
    }
    if (isJsonObject(createMessageDto)) {
      createMessageDto = JSON.parse(createMessageDto as string);
    }
    (createMessageDto as CreateMessageDto).senderId = fromUser._id;

    const { room, newMessage } = await this.messagesService.create(
      createMessageDto as CreateMessageDto,
    );
    if (!room) {
      throw new WsException({
        error: 'Bad Request',
        message: "Room's Id not found",
      });
    }

    const message = {
      text: newMessage.text,
      sender: fromUser,
      attachments: attachments || [],
      createdAt: newMessage.createdAt,
      roomId: room._id,
    };

    // if (attachments && attachments?.length > 0) {
    //   newMessage.attachments = attachments;
    // }
    // get list of client id in the room
    const stringIdList = room.members.map((item) => item.toString());
    const keys = Object.keys(this.clients).reduce((acc, cur) => {
      if (stringIdList.includes(this.clients[cur].toString())) {
        acc.push(cur);
      }
      return acc;
    }, []);

    // emit sent event to client sending message
    // this.server.to(client.id.toString()).emit('sent', newMessage);

    // emit sent event to the others in the room
    this.server.to(keys).emit('message', message);
    return message;
  }
}
