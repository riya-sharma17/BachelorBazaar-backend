"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersValidation = exports.changePasswordValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.googleLoginValidation = exports.emailLoginValidation = exports.verifyOtpValidation = exports.sendOtpValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupValidation = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).optional(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).max(30).required(),
});
exports.sendOtpValidation = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.verifyOtpValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().required()
});
exports.emailLoginValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.googleLoginValidation = joi_1.default.object({
    idToken: joi_1.default.string().required()
});
exports.forgotPasswordValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.resetPasswordValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().length(4).required(),
    newPassword: joi_1.default.string().min(6).max(30).required(),
});
exports.changePasswordValidation = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).max(30).required(),
});
exports.listUsersValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
    search: joi_1.default.string().allow("").optional(),
});
//# sourceMappingURL=user.validation.js.map