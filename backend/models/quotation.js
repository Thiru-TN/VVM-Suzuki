import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({
  model: { type: String, required: true },
  variant: { type: String, required: true },
  color: { type: String, required: true },
  insurance: { type: String, enum: ["with", "without"], required: true },
  orderDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  
  // Email will be extracted from JWT token
  email: { type: String, required: true },  
});

const Quotation = mongoose.model("Quotation", quotationSchema);
export default Quotation;