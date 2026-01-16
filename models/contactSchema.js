import mongoose from "mongoose";

const contactPageSchema = new mongoose.Schema({
  // Hero Banner Section
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  bannerImage: { type: String },

  // Form & Text Section
  formLabel: { type: String },
  formMainTitle: { type: String },

  // ✅ Enquiry Subjects (NEW)
  enquirySubjects: [
    {
      label: { type: String, required: true }
    }
  ],

  // Information Details
  contactInfo: {
    address: { type: String },
    phone: { type: String },
    email: { type: String }
  },

  // Social Media Links
  socialLinks: {
    facebook: { type: String, default: "#" },
    instagram: { type: String, default: "#" },
    youtube: { type: String, default: "#" },
    twitter: { type: String, default: "#" },
    linkedin: { type: String, default: "#" }
  },

  // Map
  mapEmbedUrl: { type: String },

  // Contact Email
  contactEmail: { type: String, default: "" }

}, { timestamps: true });

const ContactPage = mongoose.model("ContactPage", contactPageSchema);
export default ContactPage;
