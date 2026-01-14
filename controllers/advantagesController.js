import AdvantagesPage from "../models/advantagesSchema.js";

// Helper to extract file path safely
const getFilePath = (files, fieldName) => {
  if (!files) return null;
  const filesArray = Array.isArray(files) ? files : Object.values(files).flat();
  const file = filesArray.find((f) => f.fieldname === fieldName);
  return file ? file.path : null;
};

// --- CREATE OR UPDATE (UPSERT) ---
export const saveAdvantagesPage = async (req, res) => {
  try {
    // 1. Destructure text fields
    const {
      sectionTitle,
      ctaTitleLine1,
      ctaTitleLine2,
      ctaButtonText,
      ctaWhatsappText
    } = req.body;

    // 2. Parse items (JSON string)
    let items = [];
    if (req.body.items) {
      try {
        items = JSON.parse(req.body.items);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON for items" });
      }
    }

    // 3. Find existing document
    let pageData = await AdvantagesPage.findOne();

    if (!pageData) {
      // --- CREATE NEW ---
      pageData = new AdvantagesPage({
        sectionTitle,
        ctaTitleLine1,
        ctaTitleLine2,
        ctaButtonText,
        ctaWhatsappText,
        ctaImage: getFilePath(req.files, "ctaImage"),
        items: [] // We will map icons next
      });
    } else {
      // --- UPDATE EXISTING ---
      if (sectionTitle) pageData.sectionTitle = sectionTitle;
      if (ctaTitleLine1) pageData.ctaTitleLine1 = ctaTitleLine1;
      if (ctaTitleLine2) pageData.ctaTitleLine2 = ctaTitleLine2;
      if (ctaButtonText) pageData.ctaButtonText = ctaButtonText;
      if (ctaWhatsappText) pageData.ctaWhatsappText = ctaWhatsappText;

      // Update CTA Image if new file uploaded
      const newCtaImg = getFilePath(req.files, "ctaImage");
      if (newCtaImg) pageData.ctaImage = newCtaImg;
    }

    // 4. Handle Item Icons (Map uploads to specific items)
    // We expect files named like "itemIcon_0", "itemIcon_1" etc. based on index or ID
    const updatedItems = items.map((item, index) => {
      // Check if a new file exists for this item index/id
      // Assuming frontend sends keys like "itemIcon_0", "itemIcon_1"...
      const iconFile = getFilePath(req.files, `itemIcon_${index}`);
      
      return {
        title: item.title,
        description: item.description,
        // Use new icon if uploaded, else keep existing string, else null
        icon: iconFile || item.icon 
      };
    });

    pageData.items = updatedItems;

    await pageData.save();

    res.status(200).json({
      success: true,
      message: "Advantages page saved successfully",
      data: pageData,
    });

  } catch (error) {
    console.error("Advantages Save Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- GET ---
export const getAdvantagesPage = async (req, res) => {
  try {
    const data = await AdvantagesPage.findOne();
    if (!data) {
      return res.status(200).json({ success: true, data: null, message: "No data found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdvantagesPage = async (req, res) => {
  try {
    const data = await AdvantagesPage.findOneAndDelete();
    if (!data) {
      return res.status(404).json({ success: false, message: "No data found to delete" });
    }
    res.status(200).json({ success: true, message: "Advantages page deleted successfully" });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    }
};
