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
const dotenv = __importStar(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv.config();
const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
};
exports.generateOTP = generateOTP;
const sendOTP = async (email, OTP) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASS,
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
    }
    catch (error) {
        console.error("OTP Email failed:", {
            message: error.message,
            code: error.code,
            response: error.response
        });
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};
exports.sendOTP = sendOTP;
//# sourceMappingURL=OTP.js.map