import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    mdTitle: { type: String, default: "MD's Message" },
    mdMessage: { type: String, required: true },
    mdName: { type: String, default: null },
    mdPhoto: { type: String, default: null },
    mdSignature: { type: String, default: null },
    
    // New field added here
    gratitudeText: { type: String, default: "" }, 

    connectTitle: { type: String },
    connectSubtitle: { type: String },
  },
  { timestamps: true }
);

const MessagePage = mongoose.model("MessagePage", messageSchema);

export default MessagePage;