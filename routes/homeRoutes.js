import express from "express";
// Import your existing models (adjust paths as needed)
import Hero from "../models/heroSchema.js";
import HomeAbout from "../models/homeAboutSchema.js";
import HomeServices from "../models/servicesHomeSchema.js";
import Banner from "../models/bannerSchema.js";
import Advantages from "../models/advantagesSchema.js";
import Message from "../models/messageSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Use Promise.all to fetch everything in parallel (fastest way)
    const [hero, about, services, banner, advantages, message] = await Promise.all([
      Hero.findOne(),         // Assuming single document structure
      HomeAbout.findOne(),
      HomeServices.find(),    // or findOne depending on your structure
      Banner.findOne(),
      Advantages.find(),
      Message.findOne()
    ]);

    // Debug logging
    console.log("📊 Home Content Fetch:");
    console.log("  - Hero:", hero ? "✅ Found" : "❌ Not found");
    console.log("  - About:", about ? "✅ Found" : "❌ Not found");
    console.log("  - Services:", services ? `✅ Found ${services.length} items` : "❌ Not found");
    console.log("  - Banner:", banner ? "✅ Found" : "❌ Not found");
    console.log("  - Advantages:", advantages ? `✅ Found ${advantages.length} items` : "❌ Not found");
    console.log("  - Message:", message ? "✅ Found" : "❌ Not found");
    if (message) {
      console.log("  - Message Data:", JSON.stringify(message, null, 2));
    }

    // Return one unified object
    res.status(200).json({
      success: true,
      data: {
        hero,
        about,
        services,
        banner,
        advantages,
        message
      }
    });
  } catch (error) {
    console.error("Error fetching home content:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;