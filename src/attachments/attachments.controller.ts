import {
  BadRequestException,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';
import { IBatchUploadFile, IUploadFile } from './dto/attachment.interface';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadOne(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<IUploadFile> {
    if (!file) throw new BadRequestException('No file uploaded');
    const { mimetype, filename, originalname, size } = file;
    const user = await this.userService.findOne(req.user._id);
    const attachment = await this.attachmentsService.create({
      filename,
      mimetype,
      originalname,
      size,
      owner: user,
    });

    return {
      _id: attachment._id,
      filename: attachment.filename,
      mimetype,
      size,
    };
  }

  @Post('batch-upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMany(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ): Promise<IBatchUploadFile> {
    if (!files.length) throw new BadRequestException('No files uploaded');
    const user = await this.userService.findOne(req.user._id);
    const attachments = await Promise.all(
      files.map((file) =>
        this.attachmentsService.create({
          filename: file.filename,
          mimetype: file.mimetype,
          originalname: file.originalname,
          size: file.size,
          owner: user,
        }),
      ),
    );
    return {
      attachments: attachments.map((attachment) => ({
        _id: attachment._id,
        mimetype: attachment.mimetype,
        size: attachment.size,
      })),
    };
  }

  @Get(':id')
  async getFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid attachment id');
    const file = await this.attachmentsService.findOne({ _id: id });
    if (!file) throw new NotFoundException('File not found');
    const filePath = join(process.cwd(), 'uploads', file.filename);
    if (!existsSync(filePath))
      throw new NotFoundException('File may have been deleted on the server');
    const fileStream = createReadStream(filePath, { autoClose: true });
    response.set({
      'Content-Type': `${file.mimetype}`,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        file.originalname,
      )}"`,
    });
    return new StreamableFile(fileStream);
  }
}
