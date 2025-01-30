// src/cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'print-requests',
      });
      return result;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }
}
