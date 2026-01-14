import mongoose from "mongoose";

const FooterSchema = new mongoose.Schema(
  {
    // Office Contact Info
    officeAddress: {
      type: String,
    },
    phone: { type: String },
    whatsapp: { type: String },
    email: { type: String },
    usefulLinks: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],

    // Social Media
    socialLinks: {
      facebook: { type: String, default: "https://facebook.com/ecoglow" },
      instagram: { type: String, default: "https://instagram.com/ecoglow" },
      youtube: { type: String, default: "https://youtube.com/@ecoglow" },
    },

    // Legal
    copyrightText: {
      type: String,
      default: "Copyright © 2025 EcoGlow. All rights reserved",
    },
  },
  { timestamps: true }
);

const Footer = mongoose.model("Footer", FooterSchema);

export default Footer;
