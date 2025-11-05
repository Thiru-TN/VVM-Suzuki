import Quotation from "../models/quotation.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const submitQuotation = async (req, res) => {
  const { model, variant, color, insurance, orderDate } = req.body;

  if (!model || !variant || !color || !insurance) {
    return res.status(400).json({
      success: false,
      message: "Missing required quotation fields: model, variant, color, insurance",
    });
  }

  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "User email not found. Please log in again.",
      });
    }

    const quotation = await Quotation.create({
      model,
      variant,
      color,
      insurance,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      email: userEmail,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `VV Motors Quotation <${process.env.MAIL_USER}>`,
      to: "sivaneshsenthilkumar@gmail.com",
      subject: `New Quotation Request - ${model}`,
      html: `
        <h2>New Quotation Request</h2>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Model:</strong> ${model}</p>
        <p><strong>Variant:</strong> ${variant}</p>
        <p><strong>Color:</strong> ${color}</p>
        <p><strong>Insurance:</strong> ${insurance}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    const userMailOptions = {
      from: `VV Motors <${process.env.MAIL_USER}>`,
      to: userEmail,
      subject: "Quotation Request Received",
      html: `
        <h2>Thank you for your quotation request!</h2>
        <p>We have received your request for ${model} - ${variant} in ${color} with ${insurance} insurance.</p>
        <p>Our team will get back to you soon.</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    res.status(201).json({
      success: true,
      message: "Quotation request submitted successfully. Confirmation email sent.",
      quotationId: quotation._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit quotation request. Please try again.",
    });
  }
};