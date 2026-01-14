import mongoose from "mongoose";
const Schema = mongoose.Schema;

const HomeAboutSchema = new Schema(
  {
    heroHighlightText: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroParagraphs: { type: [String], default: [] },
    valuesCommonImage: { type: String, default: null },

    // Fixed distinct fields instead of an array
    vision: {
      title: { type: String, default: "Our Vision" },
      content: { type: String, default: "" }
    },
    mission: {
      title: { type: String, default: "Our Mission" },
      content: { type: String, default: "" }
    },
    values: {
      title: { type: String, default: "Our Values" },
      content: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const HomeAbout = mongoose.model("HomeAbout", HomeAboutSchema);
export default HomeAbout;