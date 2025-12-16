/**
 * Generate 4-digit OTP
 */
export declare const generateOTP: () => string;
/**
 * Send OTP email using Brevo SMTP
 */
export declare const sendOTP: (email: string, OTP: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
//# sourceMappingURL=OTP.d.ts.map