export interface IUploadFile {
  _id: string;
  mimetype?: string;
  originalname?: string;
  size?: number;
  filename?: string;
}

export interface IBatchUploadFile {
  attachments: IUploadFile[];
}

export interface IResponseAttchment {
  _id: string;
  filename: string;
  size: number;
}
