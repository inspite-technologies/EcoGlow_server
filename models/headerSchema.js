import mongoose from "mongoose";

const headerSchema = new mongoose.Schema(
  {
    contactWhatsApp: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
  },
  { timestamps: true }
);

const HeaderSettings = mongoose.model("HeaderSettings", headerSchema);
export default HeaderSettings;