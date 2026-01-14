import express from 'express';
// If your config file exports 'upload', use it directly
import upload from '../config/multer.js'; 
import protectAdmin from './middleWare/adminMiddleWare.js';
import { getBooking, upsertBooking } from '../controllers/bookServiceController.js';

const router = express.Router(); // Standard naming is 'router'

// Define endpoints using .route() for a clean structure
router.route("/")
  .get(getBooking)
  .post(protectAdmin,upload.single("heroBannerImage"),upsertBooking);


export default router;
