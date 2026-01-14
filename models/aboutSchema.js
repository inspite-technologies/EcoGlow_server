import mongoose from 'mongoose';

// --- Sub-Schema: Individual List Item for "Values" ---
const ValueItemSchema = new mongoose.Schema({
  id: { type: Number }, 
  head: { type: String, default: "" }, // e.g. "Conscious:"
  desc: { type: String, default: "" }  // e.g. "We make mindful choices..."
});

// --- Main Schema ---
const AboutUsSchema = new mongoose.Schema({
  
  // 1. Hero Section
  hero: {
    titlePart1: { type: String, default: "" },
    titlePart2: { type: String, default: "" },
    bannerImg: { type: String, default: null }
  },

  // 2. Intro Section
  intro: {
    heading: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" }
  },

  // 3. Slogan Section
  slogan: {
    text: { type: String, default: "" },
    bannerImg: { type: String, default: null }
  },

  // 4. Vision Section
  vision: {
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    icon: { type: String, default: null },
    image: { type: String, default: null }
  },

  // 5. Mission Section
  mission: {
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    icon: { type: String, default: null },
    image: { type: String, default: null }
  },

  // 6. Values Section
  valuesSection: {
    title: { type: String, default: "" },
    icon: { type: String, default: null },
    image: { type: String, default: null },
    list: [ValueItemSchema] // Array of value items
  },

  // 7. Clients Section
  clients: {
    title: { type: String, default: "" },
    logosImg: { type: String, default: null }
  }

}, { timestamps: true });

const AboutUs = mongoose.model("AboutUs", AboutUsSchema);

export default AboutUs;