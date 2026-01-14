import { createFaqPage, getFaqPage, updateFaqPage } from "../controllers/faqController.js";
import protectAdmin from "./middleWare/adminMiddleWare.js";
import express from "express";
import upload from "../config/multer.js"; 

const app = express.Router();

app.route("/").post(protectAdmin,upload.any(),createFaqPage);
app.route("/").put(protectAdmin,upload.any(),  updateFaqPage);
app.route("/").get(getFaqPage);


export default app;
