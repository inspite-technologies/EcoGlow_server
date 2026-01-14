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
  try {
    const banner = await Banner.findOne();
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

    // Update Text if provided
    if (req.body.text !== undefined) banner.text = req.body.text;

    // Update Images if provided
    if (req.files) {
      if (req.files.beforeImage && req.files.beforeImage[0]) {
        banner.beforeImage = req.files.beforeImage[0].path;
      }
      if (req.files.afterImage && req.files.afterImage[0]) {
        banner.afterImage = req.files.afterImage[0].path;
      }
    }

    await banner.save();

    res.status(200).json({ success: true, message: "Banner updated successfully", data: banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update banner", error: err.message });
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