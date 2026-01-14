import mongoose from 'mongoose';

// --- Sub-Schema: Individual Slide ---
const HeroSlideSchema = new mongoose.Schema({
  id: { type: Number, required: true },    // Matches your React state IDs (1, 2, 3, 4)
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  image: { type: String, default: null }   // URL to the uploaded image
});

// --- Main Schema ---
const HeroSectionSchema = new mongoose.Schema({
  // The Hero section is essentially just a container for the list of slides
  slides: [HeroSlideSchema]
}, { timestamps: true });

const HeroSection = mongoose.model("HeroSection", HeroSectionSchema);

export default HeroSection;