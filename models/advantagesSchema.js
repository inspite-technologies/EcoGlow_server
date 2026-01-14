import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Sub-schema for individual Advantage items (the accordion rows)
const AdvantageItemSchema = new Schema({
  title: { type: String, required: true },       // e.g. "Clean Without Compromise"
  description: { type: String, required: true }, // e.g. "EcoGlow ensures..."
  icon: { type: String, default: null }          // URL to the icon image
});

// Main Schema
const AdvantagesPageSchema = new Schema(
  {
    // --- Top Header ---
    sectionTitle: { type: String, default: "Our Key Advantages" },

    // --- The Accordion List ---
    items: [AdvantageItemSchema],

    // --- Bottom CTA Section ---
    ctaImage: { type: String, default: null },    
    ctaTitleLine1: { type: String },
    ctaTitleLine2: { type: String},
    ctaButtonText: { type: String },
    ctaWhatsappText: { type: String, }
  },
  { timestamps: true }
);

const AdvantagesPage = mongoose.model("AdvantagesPage", AdvantagesPageSchema);

export default AdvantagesPage;