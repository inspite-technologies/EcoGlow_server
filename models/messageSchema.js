import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    mdTitle: { type: String, default: "MD's Message" },
    mdMessage: { type: String, required: true },
    mdName: { type: String, default: null },
    mdPhoto: { type: String, default: null },
    mdSignature: { type: String, default: null },
    
    // Existing new field
    gratitudeText: { type: String, default: "" }, 

    connectTitle: { type: String },
    connectSubtitle: { type: String },
    
    // --- NEW FIELD FOR EMAIL ---
    contactEmail: { type: String, default: "" } 
  },
  { timestamps: true }
);

const MessagePage = mongoose.model("MessagePage", messageSchema);

export default MessagePage;