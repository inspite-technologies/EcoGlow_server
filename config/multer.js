import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isBannerImage =
      file.fieldname === 'beforeImage' ||
      file.fieldname === 'afterImage';

    // Sanitize filename: remove extension, trim whitespace, replace spaces/special chars
    const sanitizedFilename = file.originalname
      .split('.')[0]                    // Remove extension
      .trim()                            // Remove leading/trailing whitespace
      .replace(/\s+/g, '-')              // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_]/g, '');   // Remove special characters

    return {
      folder: 'eco-glow-uploads',
      resource_type: 'image',
      public_id: `${Date.now()}-${sanitizedFilename}`,

      // Banner images: Preserve quality (100)
      // Other images: Standard optimization
      transformation: isBannerImage
        ? [{ quality: 100 }]
        : [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
    };
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed!'), false);
      return;
    }
    cb(null, true);
  }
});

export default upload;
