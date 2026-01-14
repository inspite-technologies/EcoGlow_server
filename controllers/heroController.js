import HeroSection from "../models/heroSchema.js";

// --- GET Hero Section ---
const getHero = async (req, res) => {
  try {
    const heroData = await HeroSection.findOne();
    if (!heroData) {
      return res.status(404).json({ success: false, message: "Hero section not found" });
    }
    res.status(200).json({ success: true, data: heroData });
  } catch (error) {
    console.error("Get Hero Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- CREATE Hero Section ---
const createHero = async (req, res) => {
  try {
    const existing = await HeroSection.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Hero section already exists. Use Update." });
    }

    let filesArray = [];
    if (req.files) {
      filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    }

    let slides = [];
    if (req.body.slides) {
      slides = JSON.parse(req.body.slides);
    }

    // Map Files to Slides - buttonLink is automatically included in the 'slide' object via JSON.parse
    slides = slides.map((slide) => {
      const file = filesArray.find((f) => f.fieldname === `slideImage_${slide.id}`);
      if (file) {
        return { ...slide, image: file.path };
      }
      return slide;
    });

    const newHero = new HeroSection({ slides });
    await newHero.save();

    res.status(201).json({
      success: true,
      message: "Hero section created successfully",
      data: newHero
    });
  } catch (error) {
    console.error("Create Hero Error:", error);
    res.status(500).json({ success: false, message: "Failed to create", error: error.message });
  }
};

// --- UPDATE Hero Section ---
const updateHero = async (req, res) => {
  try {
    let heroSection = await HeroSection.findOne();
    
    // 1. Handle Section Link (Global)
    const { sectionLink } = req.body;

    // 2. Parse Slides
    let slides = [];
    if (req.body.slides) {
      slides = JSON.parse(req.body.slides);
      
      // Handle Image uploads
      let filesArray = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [];
      
      slides = slides.map((slide) => {
        const file = filesArray.find((f) => f.fieldname === `slideImage_${slide.id}`);
        return { ...slide, image: file ? file.path : slide.image };
      });
    }

    if (!heroSection) {
      heroSection = new HeroSection({ slides, sectionLink });
    } else {
      heroSection.slides = slides;
      heroSection.sectionLink = sectionLink; // Update the global link
    }

    await heroSection.save();
    res.status(200).json({ success: true, data: heroSection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { getHero, createHero, updateHero };