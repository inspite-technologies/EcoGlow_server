import express from 'express';
import upload from '../config/multer.js'
import { createServicesSection, updateServicesSection, getServicesSection } from '../controllers/commercialController.js';
import protectAdmin from './middleWare/adminMiddleWare.js';

const app = express.Router();

app.get('/', getServicesSection);
app.post('/', upload.any(), createServicesSection);
app.put('/',protectAdmin, upload.any(), updateServicesSection);


export default app;
