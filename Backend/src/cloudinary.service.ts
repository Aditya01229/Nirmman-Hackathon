import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary with credentials from environment variables
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'campaigns' },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              reject(`Cloudinary upload error: ${error.message}`);
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
}
