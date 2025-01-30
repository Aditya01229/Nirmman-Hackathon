import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the multer options
export const multerOptions = {
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      public_id: (req, file) => file.originalname.split('.')[0], // Use original filename without extension
      // Remove resource_type; it will automatically be determined
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']; // Allowed MIME types
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('File type not allowed. Only PDFs and images are accepted.'), false); // Reject the file
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
};

// Create the multer instance
const upload = multer(multerOptions);

export default upload;
