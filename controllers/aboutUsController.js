import AboutUs from "../models/aboutSchema.js";
import fs from "fs";
import path from "path";

// Helper to safely delete old files if they exist
const deleteFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.resolve(filePath);
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") console.error("Failed to delete file:", err);
  });
};

// --- CREATE About Us Section ---
const addAboutUsSection = async (req, res) => {
  try {
    // 1. Singleton Check
    const existing = await AboutUs.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "About Us already exists. Use update." });
    }

    // 2. Prepare Files Helper
    let filesArray = [];
    if (req.files) {
      filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    }
    const getPath = (fieldName) => filesArray.find((f) => f.fieldname === fieldName)?.path || null;

    // 3. Extract Text Data (Flat keys from React)
    const {
      heroTitlePart1, heroTitlePart2,
      mainHeading, introSubtitle, introDesc,
      sloganText,
      visionTitle, visionText,
      missionTitle, missionText,
      valuesTitle,
      clientsTitle
    } = req.body;

    // 4. Parse Values List (JSON String)
    let valuesList = [];
    if (req.body.valuesList) {
      valuesList = JSON.parse(req.body.valuesList);
    }

    // 5. Construct Object based on Schema Structure
    const newAboutUs = new AboutUs({
      hero: {
        titlePart1: heroTitlePart1,
        titlePart2: heroTitlePart2,
        bannerImg: getPath("heroBannerImg"),
      },
      intro: {
        heading: mainHeading,
        subtitle: introSubtitle,
        description: introDesc,
      },
      slogan: {
        text: sloganText,
        bannerImg: getPath("sloganBannerImg"),
      },
      vision: {
        title: visionTitle,
        text: visionText,
        icon: getPath("visionIcon"),
        image: getPath("visionImg"),
      },
      mission: {
        title: missionTitle,
        text: missionText,
        icon: getPath("missionIcon"),
        image: getPath("missionImg"),
      },
      valuesSection: {
        title: valuesTitle,
        icon: getPath("valuesIcon"),
        image: getPath("valuesImg"),
        list: valuesList,
      },
      clients: {
        title: clientsTitle,
        logosImg: getPath("clientLogosImg"),
      },
    });

    await newAboutUs.save();
    res.status(201).json({ success: true, message: "About Us created successfully", data: newAboutUs });

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: "Failed to create", error: error.message });
  }
};

// --- UPDATE About Us Section ---
const updateAboutUsSection = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) return res.status(404).json({ success: false, message: "About Us not found" });

    // 1. Prepare Files Helper
    let filesArray = [];
    if (req.files) {
      filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    }
    
    // Function to handle file replacement
    const updateFileField = (schemaPath, fieldName) => {
      const file = filesArray.find((f) => f.fieldname === fieldName);
      if (file) {
        // Optional: Delete old file
        // if (schemaPath) deleteFile(schemaPath); 
        return file.path;
      }
      return schemaPath; // Keep existing if no new file
    };

    // 2. Extract Text Data
    const {
      heroTitlePart1, heroTitlePart2,
      mainHeading, introSubtitle, introDesc,
      sloganText,
      visionTitle, visionText,
      missionTitle, missionText,
      valuesTitle,
      clientsTitle
    } = req.body;

    // 3. Update Fields (Map Flat React Keys -> Nested Schema Keys)

    // HERO
    if (heroTitlePart1) aboutUs.hero.titlePart1 = heroTitlePart1;
    if (heroTitlePart2) aboutUs.hero.titlePart2 = heroTitlePart2;
    aboutUs.hero.bannerImg = updateFileField(aboutUs.hero.bannerImg, "heroBannerImg");

    // INTRO
    if (mainHeading) aboutUs.intro.heading = mainHeading;
    if (introSubtitle) aboutUs.intro.subtitle = introSubtitle;
    if (introDesc) aboutUs.intro.description = introDesc;

    // SLOGAN
    if (sloganText) aboutUs.slogan.text = sloganText;
    aboutUs.slogan.bannerImg = updateFileField(aboutUs.slogan.bannerImg, "sloganBannerImg");

    // VISION
    if (visionTitle) aboutUs.vision.title = visionTitle;
    if (visionText) aboutUs.vision.text = visionText;
    aboutUs.vision.icon = updateFileField(aboutUs.vision.icon, "visionIcon");
    aboutUs.vision.image = updateFileField(aboutUs.vision.image, "visionImg");

    // MISSION
    if (missionTitle) aboutUs.mission.title = missionTitle;
    if (missionText) aboutUs.mission.text = missionText;
    aboutUs.mission.icon = updateFileField(aboutUs.mission.icon, "missionIcon");
    aboutUs.mission.image = updateFileField(aboutUs.mission.image, "missionImg");

    // VALUES
    if (valuesTitle) aboutUs.valuesSection.title = valuesTitle;
    aboutUs.valuesSection.icon = updateFileField(aboutUs.valuesSection.icon, "valuesIcon");
    aboutUs.valuesSection.image = updateFileField(aboutUs.valuesSection.image, "valuesImg");

    // VALUES LIST (Parse JSON)
    if (req.body.valuesList) {
      aboutUs.valuesSection.list = JSON.parse(req.body.valuesList);
    }

    // CLIENTS
    if (clientsTitle) aboutUs.clients.title = clientsTitle;
    aboutUs.clients.logosImg = updateFileField(aboutUs.clients.logosImg, "clientLogosImg");

    await aboutUs.save();
    res.status(200).json({ success: true, message: "About Us updated successfully", data: aboutUs });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// --- GET About Us Section ---
const getAboutUsSection = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) return res.status(404).json({ success: false, message: "About Us not found" });
    res.status(200).json({ success: true, data: aboutUs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch About Us", error: error.message });
  }
};

export { addAboutUsSection, updateAboutUsSection, getAboutUsSection };