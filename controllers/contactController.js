import ContactPage from "../models/contactSchema.js";

// GET: Fetch the single contact document
export const getContactPage = async (req, res) => {
  try {
    const data = await ContactPage.findOne();
    res.status(200).json({ success: true, data: data || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPSERT: Create or Update without needing an ID
export const updateContactPage = async (req, res) => {
  try {
    const { 
      heroTitle, 
      heroSubtitle, 
      formLabel, 
      formMainTitle, 
      mapEmbedUrl, 
      address, 
      phone, 
      email,
      // Destructure the new social fields from the request
      facebook,
      instagram,
      youtube 
    } = req.body;

    const updateData = {
      heroTitle,
      heroSubtitle,
      formLabel,
      formMainTitle,
      mapEmbedUrl,
      // Map basic contact info
      contactInfo: {
        address, 
        phone,
        email
      },
      // Map social media links based on your updated schema
      socialLinks: {
        facebook: facebook || "#",
        instagram: instagram || "#",
        youtube: youtube || "#"
      }
    };

    // Handle banner image update if a new file is uploaded
    if (req.file) {
      updateData.bannerImage = req.file.path;
    }

    const updated = await ContactPage.findOneAndUpdate(
      {}, 
      updateData, 
      { upsert: true, new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Contact page updated successfully", 
      data: updated 
    });

  } catch (error) {
    console.error("Error updating contact page:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating contact page", 
      error: error.message 
    });
  }
};