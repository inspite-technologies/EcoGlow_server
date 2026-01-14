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
    const {
      sectionTitle,
      ctaTitleLine1,
      ctaTitleLine2,
      ctaButtonText,
      ctaButtonLink,
      ctaWhatsappText,
      ctaWhatsappLink
    } = req.body;

    // Parse items safely
    let items = [];
    if (req.body.items) {
      try {
        items = JSON.parse(req.body.items);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON for items" });
      }
    }

    let pageData = await AdvantagesPage.findOne();

    if (!pageData) {
      // --- CREATE NEW ---
      pageData = new AdvantagesPage({
        sectionTitle,
        ctaTitleLine1,
        ctaTitleLine2,
        ctaButtonText,
        ctaButtonLink,
        ctaWhatsappText,
        ctaWhatsappLink,
        ctaImage: getFilePath(req.files, "ctaImage"),
        items: [] 
      });
    } else {
      // --- UPDATE EXISTING ---
      // FIX: Use (!== undefined) to allow saving empty strings ""
      
      if (sectionTitle !== undefined) pageData.sectionTitle = sectionTitle;
      if (ctaTitleLine1 !== undefined) pageData.ctaTitleLine1 = ctaTitleLine1;
      if (ctaTitleLine2 !== undefined) pageData.ctaTitleLine2 = ctaTitleLine2;
      
      // Update Buttons & Links
      if (ctaButtonText !== undefined) pageData.ctaButtonText = ctaButtonText;
      if (ctaButtonLink !== undefined) pageData.ctaButtonLink = ctaButtonLink; 
      
      // Update WhatsApp & Links
      if (ctaWhatsappText !== undefined) pageData.ctaWhatsappText = ctaWhatsappText;
      if (ctaWhatsappLink !== undefined) pageData.ctaWhatsappLink = ctaWhatsappLink; 

      // Update CTA Image only if a new file is uploaded
      const newCtaImg = getFilePath(req.files, "ctaImage");
      if (newCtaImg) pageData.ctaImage = newCtaImg;
    }

    // Handle Item Icons
    const updatedItems = items.map((item, index) => {
      const iconFile = getFilePath(req.files, `itemIcon_${index}`);
      return {
        title: item.title,
        description: item.description,
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

// ... (GET and DELETE functions remain the same) ...
export const getAdvantagesPage = async (req, res) => {
  try {
    const data = await AdvantagesPage.findOne();
    if (!data) return res.status(200).json({ success: true, data: null, message: "No data found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdvantagesPage = async (req, res) => {
  try {
    const data = await AdvantagesPage.findOneAndDelete();
    if (!data) return res.status(404).json({ success: false, message: "No data found to delete" });
    res.status(200).json({ success: true, message: "Advantages page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};