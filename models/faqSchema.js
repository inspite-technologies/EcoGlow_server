import mongoose from 'mongoose';

// --- Sub-Schema: Individual Question & Answer ---
const FaqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

// --- Main Schema ---
const FaqPageSchema = new mongoose.Schema({
  // 1. Hero Section
  heroSmall: { type: String },  // e.g. "EcoGlow"
  heroLarge: { type: String },     // e.g. "FAQs"
  heroBannerImg: { type: String, default: null },   // Optional banner image

  // 2. Intro / Section Header
  sectionLabel: { type: String },
  sectionTitle: { type: String },

  // 3. The List of FAQs
  faqs: [FaqItemSchema]

}, { timestamps: true });

const FaqPage = mongoose.model("FaqPage", FaqPageSchema);

export default FaqPage;