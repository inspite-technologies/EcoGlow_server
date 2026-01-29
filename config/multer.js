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

    return {
      folder: 'eco-glow-uploads',
      // 🔥 CRITICAL: Use 'raw' for banner images = NO processing whatsoever
      resource_type: isBannerImage ? 'raw' : 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,

      // Banner images: EMPTY transformation (raw type ignores this anyway)
      // Other images: Standard optimization
      transformation: isBannerImage
        ? []
        : [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
    };
  }
});

const upload = multer({ storage });

export default upload;
