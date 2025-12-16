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

import * as dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const generateOTP = (): string => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

export const sendOTP = async (email: string, OTP: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,  
    secure: false, 
    auth: {
      user: process.env.EMAIL_SERVICE_USER!, 
      pass: process.env.EMAIL_SERVICE_PASS!,
    },
    pool: true, 
    maxConnections: 5,
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 10000,
    tls: {
      rejectUnauthorized: false 
    }
  });

  const mailOptions = {
    from: `"BachelorBazaar" <${process.env.EMAIL_SERVICE_USER}>`,
    to: email,
    subject: "Your OTP Code - BachelorBazaar",
    text: `Your OTP is: ${OTP}. Valid for 10 minutes.`,
    html: `<h2>Your OTP Code</h2><p><strong>${OTP}</strong></p><p>Valid for 10 minutes only.</p>`
  };

  try {
    await transporter.verify(); 
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent successfully:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("OTP Email failed:", {
      message: error.message,
      code: error.code,
      response: error.response
    });
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

