import mongoose from "mongoose";

const contactPageSchema = new mongoose.Schema({
  // Hero Banner Section
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  bannerImage: { type: String }, // Stores the path to the background image

  // Form & Text Section
  formLabel: { type: String },
  formMainTitle: { type: String},
  
  // Information Details
  contactInfo: {
    address: { type: String },
    phone: { type: String },
    email: { type: String }
  },

  // Social Media Links - NEW SECTION
  socialLinks: {
    facebook: { type: String, default: "#" },
    instagram: { type: String, default: "#" },
    youtube: { type: String, default: "#" },
    twitter: { type: String, default: "#" }, // Added as an extra option
    linkedin: { type: String, default: "#" } // Added as an extra option
  },

  // Map
  mapEmbedUrl: { type: String },
}, { timestamps: true });

const ContactPage = mongoose.model("ContactPage", contactPageSchema);
export default ContactPage;