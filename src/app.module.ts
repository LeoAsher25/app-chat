import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { AttachmentsModule } from './attachments/attachments.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://leoasher:leoasher@cluster0.fawanbe.mongodb.net/AppChat',
    ),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    // }),
    UsersModule,
    RoomsModule,
    MessagesModule,
    AttachmentsModule,
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
