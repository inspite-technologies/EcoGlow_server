import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServicesPageSchema = new Schema(
  {
    mainTitle: { type: String, default: "Our Services" },
    mainDescription: { type: String, default: "" },

    card1Title: { type: String, default: "" },
    card1Subtitle: { type: String, default: "" },
    card1Image: { type: String, default: null }, 

    card2Title: { type: String, default: "" },
    card2Subtitle: { type: String, default: "" },
    card2Image: { type: String, default: null }, 

  },
  { timestamps: true }
);

const ServicesPage = mongoose.model("ServicesPage", ServicesPageSchema);

export default ServicesPage;