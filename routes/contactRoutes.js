import express from "express";
import { getContactPage, updateContactPage } from "../controllers/contactController.js";
import protectAdmin from "./middleWare/adminMiddleWare.js";
import multer from "../config/multer.js";

const router = express.Router();

// GET  /contact -> Fetch data
router.get("/", getContactPage);

// PUT  /contact -> Create OR Update (Upsert)
router.put("/",protectAdmin, multer.single("bannerImage"), updateContactPage);


export default router;
