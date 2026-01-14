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
    // 1. Singleton Check
    const existing = await HeroSection.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Hero section already exists. Use Update." });
    }

    // 2. Prepare Files
    let filesArray = [];
    if (req.files) {
      filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    }

    // 3. Parse Slides JSON
    let slides = [];
    if (req.body.slides) {
      slides = JSON.parse(req.body.slides);
    }

    // 4. Map Files to Slides
    // Expecting frontend keys: "slideImage_1", "slideImage_2", etc.
    slides = slides.map((slide) => {
      const file = filesArray.find((f) => f.fieldname === `slideImage_${slide.id}`);
      if (file) {
        return { ...slide, image: file.path };
      }
      return slide;
    });

    // 5. Save
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
    const heroSection = await HeroSection.findOne();
    if (!heroSection) {
      return res.status(404).json({ success: false, message: "Hero section not found" });
    }

    // 1. Prepare Files
    let filesArray = [];
    if (req.files) {
      filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    }

    // 2. Parse Slides JSON
    // The frontend sends the ARRAY of objects as a JSON string
    if (req.body.slides) {
      let parsedSlides = JSON.parse(req.body.slides);

      // 3. Update Images Per Slide
      parsedSlides = parsedSlides.map((slide) => {
        // Check if a NEW file was uploaded for this specific slide ID
        const file = filesArray.find((f) => f.fieldname === `slideImage_${slide.id}`);
        
        if (file) {
          // If new file, use new path
          return { ...slide, image: file.path };
        } else {
          // If no new file, keep the existing image path (which is already in the JSON)
          return slide;
        }
      });

      heroSection.slides = parsedSlides;
    }

    await heroSection.save();

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully",
      data: heroSection
    });

  } catch (error) {
    console.error("Update Hero Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

export { getHero, createHero, updateHero };