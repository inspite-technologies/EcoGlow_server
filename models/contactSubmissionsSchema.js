import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },  // Enquiry field
    message: { type: String, required: true },
    materialPreference: { type: String }, // New field for Standard Shine Options
    source: { type: String, default: "contact_form" },
    status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' }
}, { timestamps: true });

const ContactSubmission = mongoose.model("ContactSubmission", contactSubmissionSchema);
export default ContactSubmission;
