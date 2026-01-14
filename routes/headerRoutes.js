import express from 'express';
import { getHeaderSettings, updateHeaderSettings } from '../controllers/headerController.js';
import upload from '../config/multer.js'; 

const router = express.Router();

router.get('/', getHeaderSettings);
router.put('/', updateHeaderSettings);

export default router;