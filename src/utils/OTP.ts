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
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
/**
 * Generate 4-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Send OTP email using Brevo SMTP
 */
export const sendOTP = async (email: string, OTP: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // MUST be false for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: "BachelorBazaar <bachelorbazaar1@gmail.com>",
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${OTP}. It is valid for 2 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};
