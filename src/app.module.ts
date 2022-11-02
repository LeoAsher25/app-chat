import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'e ',
    ),
    UsersModule,
    RoomsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: JwtAuthGuard,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
