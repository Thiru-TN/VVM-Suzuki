import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
