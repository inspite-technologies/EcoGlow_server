import MessagePage from "../models/messageSchema.js";

// --- GET ---
export const getMessagePage = async (req, res) => {
  try {
    const data = await MessagePage.findOne();
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
      gratitudeText,
      connectTitle,
      connectSubtitle,
      contactEmail,         // <--- 1. Capture new email field
      removePhoto,
      removeSignature
    } = req.body;

    let pageData = await MessagePage.findOne();

    if (!pageData) {
      // Logic for CREATE new
      pageData = new MessagePage({
        mdTitle,
        mdMessage,
        mdName,
        gratitudeText,
        connectTitle,
        connectSubtitle,
        contactEmail        // <--- 2. Add to creation object
      });
    } else {
      // UPDATE existing text fields
      // Using (!== undefined) ensures we can save empty strings if user deletes the text
      if (mdTitle !== undefined) pageData.mdTitle = mdTitle;
      if (mdMessage !== undefined) pageData.mdMessage = mdMessage;
      if (mdName !== undefined) pageData.mdName = mdName;
      if (gratitudeText !== undefined) pageData.gratitudeText = gratitudeText;
      if (connectTitle !== undefined) pageData.connectTitle = connectTitle;
      if (connectSubtitle !== undefined) pageData.connectSubtitle = connectSubtitle;
      
      if (contactEmail !== undefined) pageData.contactEmail = contactEmail; // <--- 3. Add update logic
    }

    // --- HANDLE PHOTO REMOVAL/UPDATE ---
    if (req.files && req.files['mdPhoto']) {
      pageData.mdPhoto = req.files['mdPhoto'][0].path;
    } else if (removePhoto === 'true') {
      pageData.mdPhoto = null;
    }

    // --- HANDLE SIGNATURE REMOVAL/UPDATE ---
    if (req.files && req.files['mdSignature']) {
      pageData.mdSignature = req.files['mdSignature'][0].path;
    } else if (removeSignature === 'true') {
      pageData.mdSignature = null;
    }

    await pageData.save();
    res.status(200).json({ success: true, message: "Changes saved", data: pageData });

  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};