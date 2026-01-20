import ContactPage from "../models/contactSchema.js";

// GET Contact Page
export const getContactPage = async (req, res) => {
  try {
    const data = await ContactPage.findOne();
    res.status(200).json({
      success: true,
      data: data || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateContactPage = async (req, res) => {
  try {
    console.log("Updating Contact Page. Body:", req.body);

    // 1. Destructure all fields
    // We explicitly pull out socialLinks so it doesn't stay in 'rest'
    let { enquirySubjects, socialLinks, address, phone, email, ...rest } = req.body;

    // --- PARSE ENQUIRY SUBJECTS ---
    let parsedSubjects = [];
    if (typeof enquirySubjects === 'string') {
      try {
        parsedSubjects = JSON.parse(enquirySubjects);
      } catch (e) {
        parsedSubjects = [];
      }
    } else if (Array.isArray(enquirySubjects)) {
      parsedSubjects = enquirySubjects;
    }

    // --- ✅ FIX: PARSE SOCIAL LINKS ---
    // Ensure we start with a clean object structure
    let parsedSocialLinks = {
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
      linkedin: ""
    };

    if (socialLinks) {
      try {
        // If it came as a string (FormData), parse it. If it's already an object, use it.
        const rawLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;

        // Merge safely
        parsedSocialLinks = {
          ...parsedSocialLinks,
          ...rawLinks
        };
      } catch (err) {
        console.error("❌ Error parsing socialLinks:", err);
      }
    }

    // --- PREPARE UPDATE OBJECT ---
    const updateData = {
      ...rest, // Top level fields (heroTitle, etc.)
      contactInfo: {
        address: address || "",
        phone: phone || "",
        email: email || ""
      },
      enquirySubjects: parsedSubjects.map(s => ({ label: (s.label || s).trim() })).filter(s => s.label),
      socialLinks: parsedSocialLinks // ✅ Explicitly assigning the object
    };

    if (req.file) {
      updateData.bannerImage = req.file.path;
    }

    console.log("📦 Final Object to Save:", JSON.stringify(updateData.socialLinks, null, 2));

    // Upsert: Create if doesn't exist, Update if it does
    const updated = await ContactPage.findOneAndUpdate(
      {},
      updateData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Contact Page Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

