import multer from 'multer';
import { IMiddleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';

export class UploadMultipleFilesMiddleware implements IMiddleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private maxCount: number = 6
  ) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = multer.diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const ext = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${ext}`);
      },
    });

    const uploadMultiple = multer({ storage }).array(
      this.fieldName,
      this.maxCount
    );

    uploadMultiple(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  }
}
