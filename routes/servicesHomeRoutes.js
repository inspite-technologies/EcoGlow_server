import express from "express";
import upload from "../config/multer.js";
import { saveServicesPage, getServicesPage } from "../controllers/servicesHomeController.js";
import protectAdmin from "./middleWare/adminMiddleWare.js";

const app = express.Router();

// ---------------- ROUTES ----------------
app.route("/").get(getServicesPage);

app.route("/").post(protectAdmin,
  // This now uploads directly to Cloudinary based on field names
  upload.fields([
    { name: "card1Image", maxCount: 1 },
    { name: "card2Image", maxCount: 1 },
  ]),
  
  saveServicesPage
);


export default app;
