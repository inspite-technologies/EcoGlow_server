import { log } from "console";
import Packages from "../models/packagesSchema.js";

// --- GET Packages Section ---
const getPackages = async (req, res) => {
  try {
    const packagesData = await Packages.findOne();
    if (!packagesData) {
      return res.status(404).json({ success: false, message: "Packages section not found" });
    }
    res.status(200).json({ success: true, data: packagesData });
  } catch (error) {
    console.error("Get Packages Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- CREATE Packages Section ---
const createPackages = async (req, res) => {
  try {
    // 1. Singleton Check: Ensure only one Packages document exists
    const existing = await Packages.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Packages section already exists. Use Update." });
    }

    const {
      heroSmall,
      heroLarge,
      introLabel,
      introTitle,
      introDesc,
    } = req.body;

    // 2. Handle File Upload (Hero Banner)
    let heroBannerImg = null;
    if (req.files) {
        // Handle both upload.any() (array) and upload.fields() (object)
        let filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        const file = filesArray.find(f => f.fieldname === 'heroBannerImg');
        if (file) heroBannerImg = file.path;
    }

    // 3. Parse Nested JSON Strings (FormData sends objects as strings)
    let residential = {};
    let commercial = {};
    let tables = [];

    if (req.body.residential) residential = JSON.parse(req.body.residential);
    if (req.body.commercial) commercial = JSON.parse(req.body.commercial);
    if (req.body.tables) tables = JSON.parse(req.body.tables);

    // 4. Create and Save
    const newPackages = new Packages({
      heroSmall,
      heroLarge,
      heroBannerImg,
      introLabel,
      introTitle,
      introDesc,
      residential,
      commercial,
      tables
    });

    await newPackages.save();

    res.status(201).json({
      success: true,
      message: "Packages section created successfully",
      data: newPackages
    });

  } catch (error) {
    console.error("Create Packages Error:", error);
    res.status(500).json({ success: false, message: "Failed to create", error: error.message });
  }
};

const updatePackages = async (req, res) => {
  try {
    // 1. Find or Create Document
    let packagesDoc = await Packages.findOne();
    if (!packagesDoc) {
      packagesDoc = new Packages();
    }

    // 2. Update Simple Text Fields
    const { heroSmall, heroLarge, introLabel, introTitle, introDesc } = req.body;
    
    if (heroSmall) packagesDoc.heroSmall = heroSmall;
    if (heroLarge) packagesDoc.heroLarge = heroLarge;
    if (introLabel) packagesDoc.introLabel = introLabel;
    if (introTitle) packagesDoc.introTitle = introTitle;
    if (introDesc) packagesDoc.introDesc = introDesc;

    // 3. IMAGE LOGIC (The Fix)
    // When using FormData + upload.any(), the file is in req.files (Array)
    if (req.files && req.files.length > 0) {
        const bannerFile = req.files.find(f => f.fieldname === 'heroBannerImg');
        
        if (bannerFile) {
            packagesDoc.heroBannerImg = bannerFile.path; // Save the path to DB
        }
    }

    // 4. PARSE JSON STRINGS (Crucial for FormData)
    // FormData turns objects into strings like '{"heading":...}'. 
    // We must parse them back to JSON for MongoDB.
    try {
        if (req.body.residential) {
            packagesDoc.residential = JSON.parse(req.body.residential);
        }
        if (req.body.commercial) {
            packagesDoc.commercial = JSON.parse(req.body.commercial);
        }
        if (req.body.tables) {
            packagesDoc.tables = JSON.parse(req.body.tables);
        }
    } catch (parseError) {
        console.error(" JSON Parse Error:", parseError);
        // We continue saving even if parsing fails, but warn the log
    }

    // 5. Save
    await packagesDoc.save();
    res.status(200).json({
      success: true,
      message: "Packages updated successfully",
      data: packagesDoc
    });

  } catch (error) {
    console.error(" Update Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};
export { getPackages, createPackages, updatePackages };