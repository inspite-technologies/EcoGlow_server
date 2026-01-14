import { log } from "console";
import HomeAbout from "../models/homeAboutSchema.js";
import fs from "fs";
import path from "path";

// Helper to get file path from req.files array
const getFilePath = (files, fieldName) => {
  if (!files) return null;
  const filesArray = Array.isArray(files) ? files : Object.values(files).flat();
  const file = filesArray.find(f => f.fieldname === fieldName);
  return file ? file.path : null;
};

// --- CREATE ---
const createHomeAboutSection = async (req, res) => {
  try {
    // 1. Singleton Check
    const existing = await HomeAbout.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Section already exists. Use Update." });
    }

    const { title, description } = req.body;
    
    // 2. Parse Items (JSON string)
    let items = [];
    if (req.body.items) {
      items = JSON.parse(req.body.items);
    }

    // 3. Create Document
    const newHomeAbout = new HomeAbout({
      title,
      description,
      sectionImage: getFilePath(req.files, 'sectionImage'),
      valuesCommonImage: getFilePath(req.files, 'valuesCommonImage'),
      items: items // No icon processing needed
    });

    await newHomeAbout.save();
    res.status(201).json({ success: true, message: "Created successfully", data: newHomeAbout });

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: "Failed to create", error: error.message });
  }
};

const updateHomeAbout = async (req, res) => {
  try {
    const {
      _id,
      heroHighlightText,
      heroTitle,
      heroParagraphs,
      vision,
      mission,
      values
    } = req.body;

    // 1. Initialize the update object with simple text fields
    const updateData = {
      heroHighlightText,
      heroTitle,
    };

    // 2. Safe Parsing Helper (Prevents crashes if JSON is invalid)
    const safeParse = (data) => {
      try {
        return data ? JSON.parse(data) : undefined;
      } catch (e) {
        console.error("JSON Parse Error:", e);
        return []; // Return empty array or undefined on error
      }
    };

    // 3. Parse complex fields
    if (heroParagraphs) updateData.heroParagraphs = safeParse(heroParagraphs);
    if (vision) updateData.vision = safeParse(vision);
    if (mission) updateData.mission = safeParse(mission);
    if (values) updateData.values = safeParse(values);

    // 4. IMAGE HANDLING (The Fix for upload.any())
    // upload.any() returns an Array, not an Object. We must find the file manually.
    if (req.files && Array.isArray(req.files)) {
      
      // Look for the file with fieldname 'valuesCommonImage'
      const commonImage = req.files.find(file => file.fieldname === 'valuesCommonImage');
      
      if (commonImage) {
        // Save the Cloudinary URL to the database
        updateData.valuesCommonImage = commonImage.path;
      }
    }

    // 5. Update Database
    // If _id exists, find by ID. If not, find the first document or create one.
    const query = _id ? { _id } : {};
    
    const updated = await HomeAbout.findOneAndUpdate(
      query,
      { $set: updateData },
      { 
        new: true,   // Return the updated document
        upsert: true // Create if it doesn't exist
      }
    );

    res.status(200).json(updated);

  } catch (error) {
    console.error("About update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// --- GET ---
const getHomeAboutSection = async (req, res) => {
  const startTime = Date.now();
  console.log(`🕐 API Start Time: ${new Date().toISOString()}`);
  
  try {
    console.log("📍 getHomeAboutSection API called");
    const homeAbout = await HomeAbout.findOne();
    console.log("✅ Data fetched:", homeAbout);
    
    if (!homeAbout) {
      console.warn("⚠️ HomeAbout section not found");
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`⏱️ API End Time: ${new Date().toISOString()}`);
      console.log(`⏳ Total Duration: ${duration}ms`);
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    console.log("✔️ Returning HomeAbout data successfully");
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`⏱️ API End Time: ${new Date().toISOString()}`);
    console.log(`⏳ Total Duration: ${duration}ms`);
    
    res.status(200).json({ success: true, data: homeAbout });
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.error("❌ Get Error:", error);
    console.log(`⏱️ API End Time: ${new Date().toISOString()}`);
    console.log(`⏳ Total Duration: ${duration}ms`);
    res.status(500).json({ success: false, message: "Failed to fetch", error: error.message });
  }
};

export { createHomeAboutSection, updateHomeAbout, getHomeAboutSection };