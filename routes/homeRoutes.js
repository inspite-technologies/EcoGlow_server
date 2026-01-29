import express from "express";
// Import your existing models
import Hero from "../models/heroSchema.js";
import HomeAbout from "../models/homeAboutSchema.js";
import HomeServices from "../models/servicesHomeSchema.js";
import Banner from "../models/bannerSchema.js";
import Advantages from "../models/advantagesSchema.js";
import Message from "../models/messageSchema.js";
import Header from "../models/headerSchema.js";
import Footer from "../models/footerSchema.js";
import FullServices from "../models/servicesSchema.js";
import CommercialServices from "../models/commercialSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("GET /home-content request received");
  try {
    // Use Promise.all to fetch everything in parallel (fastest way)
    const [hero, about, services, banner, advantages, message, header, footer, resServices, commServices] = await Promise.all([
      Hero.findOne(),
      HomeAbout.findOne(),
      HomeServices.find(),
      Banner.findOne(),
      Advantages.find(),
      Message.findOne(),
      Header.findOne(),
      Footer.findOne(),
      FullServices.findOne(),
      CommercialServices.findOne()
    ]);

    // Return one unified object
    res.status(200).json({
      success: true,
      data: {
        hero,
        about,
        services,
        banner,
        advantages,
        message,
        header,
        footer,
        resServices: resServices?.servicesList || [],
        commServices: commServices?.servicesList || []
      }
    });
  } catch (error) {
    console.error("Error fetching home content:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;