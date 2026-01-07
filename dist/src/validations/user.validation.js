"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersValidation = exports.changePasswordValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.googleLoginValidation = exports.verifySignupOtpValidation = exports.sendOtpValidation = exports.loginValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const name = joi_1.default.string().min(2).max(50);
const email = joi_1.default.string().email().lowercase();
const mobileNumber = joi_1.default.string().pattern(/^[0-9]{10}$/);
const password = joi_1.default.string().min(6).max(30);
const otp = joi_1.default.string().length(4);
// signup validation
exports.signupValidation = joi_1.default.object({
    loginType: joi_1.default.string()
        .valid(enum_1.loginType.EMAIL, enum_1.loginType.MOBILE)
        .required(),
    name: name.required(),
    password: password.required(),
    email: joi_1.default.when("loginType", {
        is: enum_1.loginType.EMAIL,
        then: email.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    mobileNumber: joi_1.default.when("loginType", {
        is: enum_1.loginType.MOBILE,
        then: mobileNumber.required(),
        otherwise: joi_1.default.forbidden(),
    }),
}).options({ abortEarly: false });
// login validation
exports.loginValidation = joi_1.default.object({
    loginType: joi_1.default.string()
        .valid(enum_1.loginType.EMAIL, enum_1.loginType.MOBILE)
        .required(),
    password: password.required(),
    email: joi_1.default.when("loginType", {
        is: enum_1.loginType.EMAIL,
        then: email.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    mobileNumber: joi_1.default.when("loginType", {
        is: enum_1.loginType.MOBILE,
        then: mobileNumber.required(),
        otherwise: joi_1.default.forbidden(),
    }),
}).options({ abortEarly: false });
// send-otp validation
exports.sendOtpValidation = joi_1.default.object({
    loginType: joi_1.default.string()
        .valid(enum_1.loginType.EMAIL, enum_1.loginType.MOBILE)
        .required(),
    email: joi_1.default.when("loginType", {
        is: enum_1.loginType.EMAIL,
        then: email.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    mobileNumber: joi_1.default.when("loginType", {
        is: enum_1.loginType.MOBILE,
        then: mobileNumber.required(),
        otherwise: joi_1.default.forbidden(),
    }),
}).options({ abortEarly: false });
// verify-otp validation
exports.verifySignupOtpValidation = joi_1.default.object({
    loginType: joi_1.default.string()
        .valid(enum_1.loginType.EMAIL, enum_1.loginType.MOBILE)
        .required(),
    email: joi_1.default.when("loginType", {
        is: enum_1.loginType.EMAIL,
        then: email.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    mobileNumber: joi_1.default.when("loginType", {
        is: enum_1.loginType.MOBILE,
        then: mobileNumber.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    otp: otp.required(),
}).options({ abortEarly: false });
// google login validation
exports.googleLoginValidation = joi_1.default.object({
    idToken: joi_1.default.string().required(),
}).options({ abortEarly: false });
// forgot password validation
exports.forgotPasswordValidation = joi_1.default.object({
    loginType: joi_1.default.string()
        .valid(enum_1.loginType.EMAIL, enum_1.loginType.MOBILE)
        .required(),
    email: joi_1.default.when("loginType", {
        is: enum_1.loginType.EMAIL,
        then: email.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    mobileNumber: joi_1.default.when("loginType", {
        is: enum_1.loginType.MOBILE,
        then: mobileNumber.required(),
        otherwise: joi_1.default.forbidden(),
    }),
}).options({ abortEarly: false });
// reset password validation
exports.resetPasswordValidation = joi_1.default.object({
    loginType: joi_1.default.string()
        .valid(enum_1.loginType.EMAIL, enum_1.loginType.MOBILE)
        .required(),
    email: joi_1.default.when("loginType", {
        is: enum_1.loginType.EMAIL,
        then: email.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    mobileNumber: joi_1.default.when("loginType", {
        is: enum_1.loginType.MOBILE,
        then: mobileNumber.required(),
        otherwise: joi_1.default.forbidden(),
    }),
    otp: otp.required(),
    newPassword: password.required(),
}).options({ abortEarly: false });
// change password validation
exports.changePasswordValidation = joi_1.default.object({
    oldPassword: password.required(),
    newPassword: password.required(),
}).options({ abortEarly: false });
// user listing validation
exports.listUsersValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
    search: joi_1.default.string().trim().allow("").optional(),
}).options({ abortEarly: false });
//# sourceMappingURL=user.validation.js.map