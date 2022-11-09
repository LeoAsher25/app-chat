import { forwardRef, Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { Attachment, AttachmentSchema } from './attachment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from 'src/users/users.module';
import * as multer from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
    MulterModule.register({
      // useFactory: () => ({
      // dest: './uploads',
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = `-${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;
          const tranferedName = file.originalname.split(' ').join('_');
          const originalNameLength = tranferedName.lastIndexOf('.');
          const newName =
            tranferedName.slice(0, originalNameLength) +
            uniqueSuffix +
            tranferedName.slice(originalNameLength);

          cb(null, newName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * parseInt(process.env.MAX_FILE_SIZE || '10'),
        files: parseInt(process.env.MAX_UPLOAD_FILES || '10'),
      },
    }),
    // }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  exports: [MongooseModule, AttachmentsService],
})
export class AttachmentsModule {}
