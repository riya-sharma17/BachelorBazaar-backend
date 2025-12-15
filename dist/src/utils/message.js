"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_RESPONSE = exports.SUCCESS_RESPONSE = void 0;
exports.SUCCESS_RESPONSE = {
    USER_REGISTERED: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    GOOGLE_LOGIN_SUCCESS: "Google login successful",
    OTP_SENT: "OTP sent to email",
    PASSWORD_RESET: "Password reset successfully",
    PASSWORD_CHANGED: "Password changed successfully",
    USERS_FETCHED: "Users fetched successfully",
    OTP_VERIFIED: "OTP verified successfully",
};
exports.ERROR_RESPONSE = {
    EMAIL_ALREADY_REGISTERED: "Email already registered",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    INVALID_OR_EXPIRED_OTP: "Invalid or expired OTP",
    OLD_PASSWORD_INCORRECT: "Old password incorrect",
    fileUploadError: "Only image and video files are allowed",
    EMAIL_REQUIRED: "email is required!",
    EMAIL_NOT_EXISTS: "email not exists",
    INVALID_LOGIN: "invalid login type",
    USER_SIGNUP: "User not found, please sign up first",
    GOOGLE_ACCOUNT_NO_PASSWORD: "no google account password"
};
//# sourceMappingURL=message.js.map