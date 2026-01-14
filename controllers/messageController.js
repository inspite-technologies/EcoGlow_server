import MessagePage from "../models/messageSchema.js";

// --- GET ---
export const getMessagePage = async (req, res) => {
  try {
    const data = await MessagePage.findOne();
    // If no data exists yet, return empty object or null
    res.status(200).json({ success: true, data: data || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SAVE (Create or Update) ---
export const saveMessagePage = async (req, res) => {
  try {
    const {
      mdTitle,
      mdMessage,
      mdName,
      gratitudeText,      // <--- 1. Capture new field here
      connectTitle,
      connectSubtitle,
      removePhoto,        // Captured from frontend formData
      removeSignature     // Captured from frontend formData
    } = req.body;

    let pageData = await MessagePage.findOne();

    if (!pageData) {
      // Logic for CREATE new
      pageData = new MessagePage({
        mdTitle,
        mdMessage,
        mdName,
        gratitudeText,    // <--- 2. Add to creation object
        connectTitle,
        connectSubtitle
      });
    } else {
      // UPDATE existing text fields
      if (mdTitle !== undefined) pageData.mdTitle = mdTitle;
      if (mdMessage !== undefined) pageData.mdMessage = mdMessage;
      if (mdName !== undefined) pageData.mdName = mdName;
      if (gratitudeText !== undefined) pageData.gratitudeText = gratitudeText; // <--- 3. Add to update logic
      if (connectTitle !== undefined) pageData.connectTitle = connectTitle;
      if (connectSubtitle !== undefined) pageData.connectSubtitle = connectSubtitle;
    }

    // --- HANDLE PHOTO REMOVAL/UPDATE ---
    if (req.files && req.files['mdPhoto']) {
      // New file uploaded: Replace old path
      pageData.mdPhoto = req.files['mdPhoto'][0].path;
    } else if (removePhoto === 'true') {
      // User clicked 'X': Clear the path in DB
      pageData.mdPhoto = null;
    }

    // --- HANDLE SIGNATURE REMOVAL/UPDATE ---
    if (req.files && req.files['mdSignature']) {
      // New file uploaded
      pageData.mdSignature = req.files['mdSignature'][0].path;
    } else if (removeSignature === 'true') {
      // User clicked 'X'
      pageData.mdSignature = null;
    }

    await pageData.save();
    res.status(200).json({ success: true, message: "Changes saved", data: pageData });

  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};