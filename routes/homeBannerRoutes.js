import express from 'express';
import upload from '../config/multer.js';
import { createBanner, updateBanner, getBanner } from '../controllers/bannerController.js';
import protectAdmin from './middleWare/adminMiddleWare.js';

const app = express.Router();

// Define the file fields configuration
const bannerUploads = upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]);

app.route("/")
  .post(protectAdmin, bannerUploads, createBanner)
  .put(protectAdmin, bannerUploads, updateBanner)
  .get(getBanner);

export default app;