import TestRideBooking from "../models/testridebooking.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const submitTestRideBooking = async (req, res) => {
  const { testRideDate, testRideTime, customerAddress, bike } = req.body;

  if (!testRideDate || !testRideTime || !customerAddress || !bike) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Save booking to MongoDB
    const booking = await TestRideBooking.create({
      testRideDate: new Date(testRideDate),
      testRideTime,
      customerAddress,
      bike
    });

    // Setup Nodemailer transporter (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER || process.env.EMAIL_USER,
        pass: process.env.MAIL_PASS || process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const mailOptions = {
      from: `"VV Motors Booking" <${process.env.MAIL_USER || process.env.EMAIL_USER}>`,
      to: "sivaneshsenthilkumar@gmail.com",
      subject: "New Test Ride Booking Request",
      html: `
        <h2>New Test Ride Booking</h2>
        <p><b>Bike Model:</b> ${bike}</p>
        <p><b>Date:</b> ${new Date(testRideDate).toLocaleDateString()}</p>
        <p><b>Time Slot:</b> ${testRideTime}</p>
        <p><b>Customer Address:</b> ${customerAddress}</p>
        <hr>
        <small>This is an automated notification from your website.</small>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Test ride booking saved and emailed to owner successfully.",
      bookingId: booking._id
    });
  } catch (error) {
    console.error("Error handling test ride booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process the booking. Please try again later."
    });
  }
};
