"use strict";
// import * as dotenv from "dotenv";
// import nodemailer from "nodemailer";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = exports.generateOTP = void 0;
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/**
 * Generate 4-digit OTP
 */
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.generateOTP = generateOTP;
/**
 * Send OTP email using Brevo SMTP
 */
const sendOTP = async (email, OTP) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // MUST be false for port 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_FROM, // "BachelorBazaar <bachelorbazaar1@gmail.com>"
        to: email,
        subject: "Your OTP",
        text: `Your OTP is ${OTP}. It is valid for 2 minutes.`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP email sent:", info.messageId);
        return info;
    }
    catch (error) {
        console.error("Failed to send OTP email:", error);
        throw error;
    }
};
exports.sendOTP = sendOTP;
//# sourceMappingURL=OTP.js.map