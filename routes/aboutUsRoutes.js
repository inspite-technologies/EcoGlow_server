import express from "express";
import upload from "../config/multer.js";
import {
  addAboutUsSection,
  updateAboutUsSection,
  getAboutUsSection,
} from "../controllers/aboutUsController.js";
import protectAdmin from "./middleWare/adminMiddleWare.js";
const router = express.Router();

router.post("/",protectAdmin, upload.any(), addAboutUsSection);
router.put("/",protectAdmin, upload.any(), updateAboutUsSection);
router.get("/", getAboutUsSection);

export default router;

