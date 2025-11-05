import Contact from "../models/contact.js";

export const submitContactForm = async (req, res) => {
  const { firstName, email, phone, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    await Contact.create({ firstName, email, phone, message });
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save contact message" });
  }
};
