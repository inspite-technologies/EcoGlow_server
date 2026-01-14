import mongoose from "mongoose";

const ServiceCardSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  image: { type: String, default: null },
  desc: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" }
});

const CommercialServicesSchema = new mongoose.Schema({
  bannerImage: { type: String, default: null },
  heroTitlePart1: { type: String, default: "" },
  heroTitlePart2: { type: String, default: "" },
  introLabel: { type: String, default: "" },
  introMainTitle: { type: String, default: "" },
  introDescription: { type: String, default: "" },
  introLongText: { type: String, default: "" },
  introSideImage: { type: String, default: null },
  gridMainHeading: { type: String, default: "" },
  gridSubheading: { type: String, default: "" },
  servicesList: [ServiceCardSchema],
  trustedText: { type: String, default: "" },
  newsletterTitle: { type: String, default: "" },
  newsletterSubtitle: { type: String, default: "" },

  // Contact Email for Newsletter Notifications
  contactEmail: { type: String, default: "" }
}, {
  timestamps: true
});

const CommercialServices = mongoose.model('CommercialServices', CommercialServicesSchema);
export default CommercialServices;