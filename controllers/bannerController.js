import Banner from '../models/bannerSchema.js';

const createBanner = async (req, res) => {
  try {
    // 1. Singleton Check
    const existing = await Banner.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Banner already exists. Use Update." });
    }

    const { text } = req.body;
    let beforePath = null;
    let afterPath = null;

    // Handle File Uploads (Expects req.files object from upload.fields)
    if (req.files) {
      if (req.files.beforeImage && req.files.beforeImage[0]) {
        beforePath = req.files.beforeImage[0].path;
      }
      if (req.files.afterImage && req.files.afterImage[0]) {
        afterPath = req.files.afterImage[0].path;
      }
    }

    const newBanner = new Banner({
      text,
      beforeImage: beforePath,
      afterImage: afterPath
    });

    await newBanner.save();
    res.status(201).json({ success: true, message: "Banner created successfully", data: newBanner });
  } catch (error) {
    console.error("Create Banner Error:", error);
    res.status(500).json({ success: false, message: "Failed to create Banner", error: error.message });
  }
};

const updateBanner = async (req, res) => {
  console.log("🔥 Request received at updateBanner");
  console.log("📝 Request body:", req.body);
  console.log("📁 Files received:", req.files);

  try {
    // 1. Find or Create Banner (Upsert Logic)
    let banner = await Banner.findOne();
    if (!banner) {
      console.log("No banner found. Creating new one.");
      banner = new Banner({ text: "Default", beforeImage: "", afterImage: "" });
    }

    // 2. Update Text
    if (req.body.text) {
      console.log("Updating text to:", req.body.text);
      banner.text = req.body.text;
    }

    // 3. Update Images
    if (req.files) {
      if (req.files.beforeImage?.[0]) {
        console.log("✅ Before image uploaded to:", req.files.beforeImage[0].path);
        banner.beforeImage = req.files.beforeImage[0].path;
      }
      if (req.files.afterImage?.[0]) {
        console.log("✅ After image uploaded to:", req.files.afterImage[0].path);
        banner.afterImage = req.files.afterImage[0].path;
      }
    }

    console.log("💾 Saving banner to database...");
    await banner.save();
    console.log("✅ Banner saved successfully!");

    res.status(200).json({ success: true, data: banner });

  } catch (error) {
    console.error("❌ CRITICAL SERVER ERROR in updateBanner:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Send detailed error response
    res.status(500).json({
      success: false,
      message: "Server Error During Banner Update",
      errorName: error.name,
      errorMessage: error.message,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    console.error("Get Banner Error:", error);
    res.status(500).json({ success: false, message: "Failed to get Banner", error: error.message });
  }
};

export { createBanner, updateBanner, getBanner };