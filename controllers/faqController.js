import FaqPage from "../models/faqSchema.js";


// --- GET FAQ Data ---
const getFaqPage = async (req, res) => {
  try {
    const data = await FaqPage.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "FAQ page data not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Get FAQ Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- CREATE FAQ Data ---
const createFaqPage = async (req, res) => {
  try {
    // 1. Singleton Check: Prevent duplicates
    const existing = await FaqPage.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "FAQ page already exists. Use Update." });
    }

    const {
      heroSmall,
      heroLarge,
      sectionLabel,
      sectionTitle
    } = req.body;

    // 2. Handle File Upload (Hero Banner)
    let heroBannerImg = null;
    if (req.files) {
      // Support both upload.any() and upload.fields()
      const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      const file = filesArray.find(f => f.fieldname === 'heroBannerImg');
      if (file) heroBannerImg = file.path;
    }

    // 3. Parse FAQ List (JSON string from FormData)
    let faqs = [];
    if (req.body.faqs) {
      faqs = JSON.parse(req.body.faqs);
    }

    // 4. Create Document
    const newFaqPage = new FaqPage({
      heroSmall,
      heroLarge,
      heroBannerImg,
      sectionLabel,
      sectionTitle,
      faqs
    });

    await newFaqPage.save();

    res.status(201).json({
      success: true,
      message: "FAQ page created successfully",
      data: newFaqPage
    });

  } catch (error) {
    console.error("Create FAQ Error:", error);
    res.status(500).json({ success: false, message: "Failed to create", error: error.message });
  }
};

const updateFaqPage = async (req, res) => {
  try {
    const faqPage = await FaqPage.findOne();
    if (!faqPage) {
      return res.status(404).json({ success: false, message: "FAQ page not found" });
    }

    const {
      heroSmall,
      heroLarge,
      sectionLabel,
      sectionTitle
    } = req.body;

    // 1. Update Text Fields
    if (heroSmall) faqPage.heroSmall = heroSmall;
    if (heroLarge) faqPage.heroLarge = heroLarge;
    if (sectionLabel) faqPage.sectionLabel = sectionLabel;
    if (sectionTitle) faqPage.sectionTitle = sectionTitle;

    // 2. Update FAQ List
    if (req.body.faqs) {
      // JSON.parse is required because FormData sends arrays as strings
      faqPage.faqs = JSON.parse(req.body.faqs);
    }

    // 3. Update Banner Image
    if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'heroBannerImg');
      if (file) {
        faqPage.heroBannerImg = file.path;
      }
    }

    await faqPage.save();

    res.status(200).json({
      success: true,
      message: "FAQ page updated successfully",
      data: faqPage
    });

  } catch (error) {
    console.error("Update FAQ Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};
export { getFaqPage, createFaqPage, updateFaqPage };