import ServicesPage from "../models/servicesHomeSchema.js";

// Helper to extract file path safely
const getFilePath = (files, fieldName) => {
  if (!files) return null;
  // Handle both array of files (upload.any) or object of arrays (upload.fields)
  const filesArray = Array.isArray(files) ? files : Object.values(files).flat();
  const file = filesArray.find((f) => f.fieldname === fieldName);
  return file ? file.path : null;
};

export const saveServicesPage = async (req, res) => {
  try {
    const {
      mainTitle,
      mainDescription,
      card1Title,
      card1Subtitle,
      card2Title,
      card2Subtitle,
    } = req.body;

    let servicePlans = [];
    if (req.body.servicePlans) {
      servicePlans = JSON.parse(req.body.servicePlans);
    }

    const updateData = {
      mainTitle,
      mainDescription,
      card1Title,
      card1Subtitle,
      card2Title,
      card2Subtitle,
      servicePlans,
    };

    // ✅ Add images ONLY if uploaded
    if (req.files?.card1Image) {
      updateData.card1Image = req.files.card1Image[0].path;
    }

    if (req.files?.card2Image) {
      updateData.card2Image = req.files.card2Image[0].path;
    }

    const servicesPage = await ServicesPage.findOneAndUpdate(
      {}, // 🔥 no condition → single document
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Services page saved successfully",
      data: servicesPage,
    });
  } catch (error) {
    console.error("Services save error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- GET ---
export const getServicesPage = async (req, res) => {
  try {
    const data = await ServicesPage.findOne();

    // If no data exists yet, return empty structure or null
    // This prevents frontend from breaking if the admin hasn't saved anything yet
    if (!data) {
      return res.status(200).json({
        success: true,
        message: "No data found, returning defaults",
        data: null,
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Get Services Page Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
