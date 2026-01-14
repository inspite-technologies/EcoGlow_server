import express from 'express';
import upload from '../config/multer.js'; // Import the new middleware
import { saveAdvantagesPage, getAdvantagesPage } from '../controllers/advantagesController.js';
import protectAdmin from './middleWare/adminMiddleWare.js';

const app = express.Router();

app.route("/").post(protectAdmin,upload.any(),  saveAdvantagesPage);
app.route("/").get(getAdvantagesPage);


export default app;
