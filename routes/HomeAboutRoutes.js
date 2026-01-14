import express from "express";
import upload from "../config/multer.js"; // Import the new middleware
import { createHomeAboutSection, updateHomeAbout, getHomeAboutSection } from "../controllers/HomeAboutController.js";
import protectAdmin from "./middleWare/adminMiddleWare.js";

const app = express.Router();

app.route("/").post(protectAdmin,upload.any(),  createHomeAboutSection);
app.route("/").put(protectAdmin,upload.any(),updateHomeAbout);
app.route("/").get(getHomeAboutSection);


export default app;
