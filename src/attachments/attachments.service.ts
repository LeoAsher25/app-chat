import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Attachment } from './attachment.schema';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentModel: Model<Attachment>,
  ) {}

  async create(attachment: CreateAttachmentDto): Promise<Attachment> {
    const createdAttachment = new this.attachmentModel({
      ...attachment,
      uploadedAt: new Date(),
    });
    return await createdAttachment.save();
  }

  find(
    filter: FilterQuery<Attachment>,
    returnFields?: { [key: string]: 0 | 1 },
    queryOptions?: QueryOptions,
  ): Promise<Attachment[]> {
    return this.attachmentModel.find(filter, returnFields, queryOptions).exec();
  }

  findOne(
    filter: FilterQuery<Attachment>,
    returnFields?: { [key: string]: 0 | 1 },
    options?: QueryOptions,
  ): Promise<Attachment> {
    return this.attachmentModel.findOne(filter, returnFields, options).exec();
  }

  download(
    filter: FilterQuery<Attachment>,
    returnFields?: { [key: string]: 0 | 1 },
    options?: QueryOptions,
  ): Promise<Attachment> {
    return this.attachmentModel.findOne(filter, returnFields, options).exec();
  }
}
