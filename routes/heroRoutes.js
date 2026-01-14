import express from "express";
import upload from "../config/multer.js"; // Import the new middleware
import { createHero, updateHero, getHero } from "../controllers/heroController.js";
import protectAdmin from "./middleWare/adminMiddleWare.js";

const app = express.Router();

app.route("/").post(protectAdmin,upload.any(),createHero);
app.route("/").put(protectAdmin,upload.any(),updateHero);
app.route("/").get(getHero);


export default app;
