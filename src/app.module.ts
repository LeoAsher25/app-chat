import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://leoasher:leoasher@cluster0.fawanbe.mongodb.net/AppChat',
    ),
    UsersModule,
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
