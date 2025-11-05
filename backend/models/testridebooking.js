import mongoose from "mongoose";

const testRideBookingSchema = new mongoose.Schema({
  testRideDate: { type: Date, required: true },
  testRideTime: { type: String, required: true },
  customerAddress: { type: String, required: true },
  bike: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TestRideBooking = mongoose.model("TestRideBooking", testRideBookingSchema);
export default TestRideBooking;
