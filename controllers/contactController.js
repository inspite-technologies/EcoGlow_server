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
    let { enquirySubjects, address, phone, email, ...rest } = req.body;

    // ✅ STEP 1: Parse the string back into an array
    if (typeof enquirySubjects === 'string') {
      try {
        enquirySubjects = JSON.parse(enquirySubjects);
      } catch (e) {
        enquirySubjects = [];
      }
    }

    const updateData = {
      ...rest,
      contactInfo: { address, phone, email },
      // ✅ STEP 2: Ensure it fits the Schema [{ label: "..." }]
      enquirySubjects: Array.isArray(enquirySubjects) 
        ? enquirySubjects.map(s => ({ label: s.label || s })) 
        : []
    };

    if (req.file) {
      updateData.bannerImage = req.file.path;
    }

    const updated = await ContactPage.findOneAndUpdate({}, updateData, { upsert: true, new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
