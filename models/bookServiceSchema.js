import mongoose from "mongoose";

const BookServiceSchema = new mongoose.Schema({
  // Hero Section
  heroSmallText: { type: String, default: "Book Your" },
  heroLargeText: { type: String, default: "Services" },
  heroBannerImage: { type: String }, 
  
  // Section Header
  topLabel: { type: String, default: "BOOK YOUR SERVICE" },
  sectionSmallLabel: { type: String, default: "Book Now" },
  sectionMainTitle: { type: String, default: "Let us know you are interested:" },
  sectionSubtitle: { type: String, default: "All fields are mandatory" },

  // Form Buttons
  submitButtonText: { type: String, default: "Submit" },
  resetButtonText: { type: String, default: "Reset" },
}, { timestamps: true });

const BookService = mongoose.model("BookService", BookServiceSchema);

export default BookService;