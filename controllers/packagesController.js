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

    // Handle Hero Banner Upload
    let heroBannerImg = null;
    if (req.files) {
      let filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      const file = filesArray.find(f => f.fieldname === 'heroBannerImg');
      if (file) heroBannerImg = file.path;
    }

    // Parse JSON strings safely
    let residential = {};
    let commercial = {};
    let tables = [];

    try {
      if (req.body.residential) residential = JSON.parse(req.body.residential);
      if (req.body.commercial) commercial = JSON.parse(req.body.commercial);
      if (req.body.tables) tables = JSON.parse(req.body.tables);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid JSON format", error: err.message });
    }

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

// --- UPDATE Packages Section ---
const updatePackages = async (req, res) => {
  try {
    let packagesDoc = await Packages.findOne();
    if (!packagesDoc) {
      packagesDoc = new Packages();
    }

    const { heroSmall, heroLarge, introLabel, introTitle, introDesc } = req.body;

    if (heroSmall) packagesDoc.heroSmall = heroSmall;
    if (heroLarge) packagesDoc.heroLarge = heroLarge;
    if (introLabel) packagesDoc.introLabel = introLabel;
    if (introTitle) packagesDoc.introTitle = introTitle;
    if (introDesc) packagesDoc.introDesc = introDesc;

    // Handle Hero Banner Image Update
    if (req.files && req.files.length > 0) {
      const bannerFile = req.files.find(f => f.fieldname === 'heroBannerImg');
      if (bannerFile) {
        packagesDoc.heroBannerImg = bannerFile.path;
      }
    }

    // Parse JSON safely
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
      return res.status(400).json({ success: false, message: "Invalid JSON format", error: parseError.message });
    }

    await packagesDoc.save();

    res.status(200).json({
      success: true,
      message: "Packages updated successfully",
      data: packagesDoc
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

export { getPackages, createPackages, updatePackages };
