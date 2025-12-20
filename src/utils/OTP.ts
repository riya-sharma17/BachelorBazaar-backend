import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTP = async (email: string, OTP: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  console.log("email--------------------------------------",  process.env.EMAIL_SERVICE_USER);
  console.log("password-------------------------------------", process.env.EMAIL_APP_PASSWORD);

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
