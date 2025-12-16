// import * as dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config();

// export const generateOTP = (): string => {
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   return otp.toString();
// };

// export const sendOTP = async (email: string, OTP: string) => {
//   const transporter = nodemailer.createTransport({
//     // service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_SERVICE_USER,
//       pass: process.env.EMAIL_SERVICE_PASS,
//     },
//      connectionTimeout: 5000,
//     socketTimeout: 5000,
//   });

//   const mailOptions = {
//     // from: process.env.EMAIL_SERVICE_USER,
//     from: `"BachelorBazaar" <${process.env.EMAIL_SERVICE_USER}>`,
//     to: email,
//     subject: "Your OTP",
//     text: `your otp is: ${OTP}`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.response);
//     return info;
//   } catch (error) {
//     console.error("Failed to send OTP email:", error);
//     throw error;
//   }
// };


import { Resend } from 'resend';
import * as dotenv from "dotenv";

dotenv.config();

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOTP = async (email: string, OTP: string) => {
  try {
    const { data, error } = await resend.emails.send({
      // Use 'onboarding@resend.dev' for testing or verify your own domain on Resend
      from: 'BachelorBazaar <onboarding@resend.dev>',
      to: email,
      subject: 'Your Verification Code',
      text: `Your OTP is: ${OTP}. It expires in 2 minutes.`,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error("Failed to send email via API");
    }

    console.log("Email sent successfully via Resend:", data?.id);
    return data;
  } catch (error) {
    console.error("sendOTP helper error:", error);
    throw error;
  }
};
