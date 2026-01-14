import mongoose from "mongoose";

const ServiceCardSchema = new mongoose.Schema({
  title: { 
    type: String, 
    default: "" 
  },
  subtitle: { 
    type: String, 
    default: "" 
  },
  image: { 
    type: String, 
    default: null 
  },
  desc: { 
    type: String, 
    default: "" 
  }
});

/**
 * Main Schema for the Full Services Page
 */
const FullServicesSchema = new mongoose.Schema({
  // Banner & Hero
  bannerImage: { type: String, default: null },
  heroTitlePart1: { type: String, default: "" },
  heroTitlePart2: { type: String, default: "" },

  // Intro Section
  introLabel: { type: String, default: "" },
  introMainTitle: { type: String, default: "" },
  introDescription: { type: String, default: "" },
  introLongText: { type: String, default: "" },
  introSideImage: { type: String, default: null },

  // Grid Section
  gridMainHeading: { type: String, default: "" },
  gridSubheading: { type: String, default: "" },
  
  // Array of Service Cards
  servicesList: [ServiceCardSchema],

  // Trust & Newsletter
  trustedText: { type: String, default: "" },
  newsletterTitle: { type: String, default: "" },
  newsletterSubtitle: { type: String, default: "" }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Exporting the model as FullServices
const FullServices = mongoose.model('FullServices', FullServicesSchema);
export default FullServices;
