import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BannerSchema = new Schema(
  {
    text: { type: String, default: "" },
    beforeImage: { type: String, default: null }, // Renamed from image
    afterImage: { type: String, default: null },  // New field
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", BannerSchema);

export default Banner;