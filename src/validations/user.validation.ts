import Joi from "joi";
import { loginType as loginTypeEnum } from "../utils/enum";

const name = Joi.string().min(2).max(50);
const email = Joi.string().email().lowercase();
const mobileNumber = Joi.string().pattern(/^[0-9]{10}$/);
const password = Joi.string().min(6).max(30);
const otp = Joi.string().length(4);

/* =========================
   SIGNUP (OTP REQUIRED)
========================= */
export const signupValidation = Joi.object({
  loginType: Joi.string()
    .valid(loginTypeEnum.EMAIL, loginTypeEnum.MOBILE)
    .required(),

  name: name.required(),
  password: password.required(),
  otp: otp.required(),

  email: Joi.when("loginType", {
    is: loginTypeEnum.EMAIL,
    then: email.required(),
    otherwise: Joi.forbidden(),
  }),

  mobileNumber: Joi.when("loginType", {
    is: loginTypeEnum.MOBILE,
    then: mobileNumber.required(),
    otherwise: Joi.forbidden(),
  }),
}).options({ abortEarly: false });

/* =========================
   LOGIN (PASSWORD ONLY)
========================= */
export const loginValidation = Joi.object({
  loginType: Joi.string()
    .valid(loginTypeEnum.EMAIL, loginTypeEnum.MOBILE)
    .required(),

  password: password.required(),

  email: Joi.when("loginType", {
    is: loginTypeEnum.EMAIL,
    then: email.required(),
    otherwise: Joi.forbidden(),
  }),

  mobileNumber: Joi.when("loginType", {
    is: loginTypeEnum.MOBILE,
    then: mobileNumber.required(),
    otherwise: Joi.forbidden(),
  }),
}).options({ abortEarly: false });

/* =========================
   SEND OTP (SIGNUP / RESET)
========================= */
export const sendOtpValidation = Joi.object({
  loginType: Joi.string()
    .valid(loginTypeEnum.EMAIL, loginTypeEnum.MOBILE)
    .required(),

  email: Joi.when("loginType", {
    is: loginTypeEnum.EMAIL,
    then: email.required(),
    otherwise: Joi.forbidden(),
  }),

  mobileNumber: Joi.when("loginType", {
    is: loginTypeEnum.MOBILE,
    then: mobileNumber.required(),
    otherwise: Joi.forbidden(),
  }),
}).options({ abortEarly: false });

/* =========================
   VERIFY OTP (SIGNUP)
========================= */
export const verifySignupOtpValidation = Joi.object({
  loginType: Joi.string()
    .valid(loginTypeEnum.EMAIL, loginTypeEnum.MOBILE)
    .required(),

  email: Joi.when("loginType", {
    is: loginTypeEnum.EMAIL,
    then: email.required(),
    otherwise: Joi.forbidden(),
  }),

  mobileNumber: Joi.when("loginType", {
    is: loginTypeEnum.MOBILE,
    then: mobileNumber.required(),
    otherwise: Joi.forbidden(),
  }),

  otp: otp.required(),
}).options({ abortEarly: false });

/* =========================
   GOOGLE LOGIN
========================= */
export const googleLoginValidation = Joi.object({
  idToken: Joi.string().required(),
}).options({ abortEarly: false });

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPasswordValidation = Joi.object({
  email: email.required(),
}).options({ abortEarly: false });

/* =========================
   RESET PASSWORD
========================= */
export const resetPasswordValidation = Joi.object({
  email: email.required(),
  otp: otp.required(),
  newPassword: password.required(),
}).options({ abortEarly: false });

/* =========================
   CHANGE PASSWORD
========================= */
export const changePasswordValidation = Joi.object({
  oldPassword: password.required(),
  newPassword: password.required(),
}).options({ abortEarly: false });

/* =========================
   LIST USERS
========================= */
export const listUsersValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().trim().allow("").optional(),
}).options({ abortEarly: false });
