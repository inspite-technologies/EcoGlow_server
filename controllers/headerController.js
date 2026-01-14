import HeaderSettings from "../models/headerSchema.js";

// --- GET ---
export const getHeaderSettings = async (req, res) => {
  try {
    const settings = await HeaderSettings.findOne();
    res.status(200).json({ success: true, data: settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- UPDATE ---
export const updateHeaderSettings = async (req, res) => {
  try {
    const { contactWhatsApp, contactPhone } = req.body;
    
    // Only update these two fields
    const updateData = {
      contactWhatsApp,
      contactPhone
    };

    const updated = await HeaderSettings.findOneAndUpdate(
      {}, 
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: "Contacts updated", data: updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};