import Joi from "joi";

export const signupValidation = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const sendOtpValidation = Joi.object({
  email: Joi.string().email().required()
});

export const verifyOtpValidation = Joi.object({
  email: Joi.string().email().required(),
   otp: Joi.string().required()
});

export const emailLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const googleLoginValidation = Joi.object({
  idToken: Joi.string().required()
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(4).required(),
  newPassword: Joi.string().min(6).max(30).required(),
});

export const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(30).required(),
});

export const listUsersValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().allow("").optional(),
});
