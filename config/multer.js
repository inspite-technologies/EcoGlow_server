import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Ensure these are set in your Render Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'eco-glow-uploads',
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      
      // 👇 THIS BLOCK REDUCES THE SIZE
      transformation: [
        { width: 1000, crop: "limit" }, // If image is >1000px, shrink it.
        { quality: "auto" },            // Smart compression (visually same, file much smaller)
        { fetch_format: "auto" }        // Convert to WebP (faster loading)
      ]
    };
  },
});

const upload = multer({ storage: storage });

export default upload;

