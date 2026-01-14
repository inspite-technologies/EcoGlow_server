import express from 'express';
import upload from '../config/multer.js'; 
import { getMessagePage, saveMessagePage } from '../controllers/messageController.js';
import { sendNewsletterNotification } from '../controllers/emailController.js'; // <--- 1. Import Email Controller
import protectAdmin from './middleWare/adminMiddleWare.js';

const router = express.Router();

// Get the Message Page Data
router.get('/', getMessagePage);

// Save/Update Message Page Data (Protected & Uploads)
router.post('/', upload.fields([
  { name: 'mdPhoto', maxCount: 1 },
  { name: 'mdSignature', maxCount: 1 }
]), protectAdmin, saveMessagePage); 

// --- 2. Add New Route for Sending Emails ---
// Note: No 'protectAdmin' here because public users need to access this to subscribe.
router.post('/send-newsletter', sendNewsletterNotification);

export default router;