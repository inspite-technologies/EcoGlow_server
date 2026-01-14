import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServicesPageSchema = new Schema(
  {
    mainTitle: { type: String, default: "Our Services" },
    mainDescription: { type: String, default: "" },
    mainLink: { type: String, default: "" }, // 🔥 Added Common Section Link

    card1Title: { type: String, default: "" },
    card1Subtitle: { type: String, default: "" },
    card1Image: { type: String, default: null }, 
    card1Link: { type: String, default: "" },  // 🔥 Added Card 1 Link

    card2Title: { type: String, default: "" },
    card2Subtitle: { type: String, default: "" },
    card2Image: { type: String, default: null }, 
    card2Link: { type: String, default: "" },  // 🔥 Added Card 2 Link
  },
  { timestamps: true }
);

const ServicesPage = mongoose.model("ServicesPage", ServicesPageSchema);

export default ServicesPage;