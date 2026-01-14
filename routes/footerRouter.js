import express from 'express';
import { getFooter, upsertFooter } from '../controllers/footerController.js';
import protectAdmin from './middleWare/adminMiddleWare.js';
const router = express.Router();

router.route('/')
  .get(getFooter)
  .post(protectAdmin,upsertFooter);

export default router;