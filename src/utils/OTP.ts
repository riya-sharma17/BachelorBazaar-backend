import * as dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const generateOTP = (): string => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

export const sendOTP = async (email: string, OTP: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SERVICE_USER,
    to: email,
    subject: "Your OTP",
    text: `your otp is: ${OTP}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};
