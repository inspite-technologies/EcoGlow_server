import mongoose from "mongoose";

const BookServiceSchema = new mongoose.Schema(
  {
    // Hero Section
    heroSmallText: { type: String, default: "Book Your" },
    heroLargeText: { type: String, default: "Services" },
    heroBannerImage: { type: String },

    // Section Header
    topLabel: { type: String },
    sectionSmallLabel: { type: String },
    sectionMainTitle: { type: String },
    sectionSubtitle: { type: String },

    // Form Buttons
    submitButtonText: { type: String, default: "Submit" },
    resetButtonText: { type: String, default: "Reset" },
    cleaningForOptions: {
      type: [String],
      default: ["Residential", "Commercial"],
    },
    bedroomOptions: { type: [String], default: ["Studio", "1 Bedroom"] },

    // Contact Email for Form Submissions
    contactEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

const BookService = mongoose.model("BookService", BookServiceSchema);

export default BookService;
