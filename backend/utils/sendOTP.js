import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"VV Motors" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h3>${otp}</h3>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
