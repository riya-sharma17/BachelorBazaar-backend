import express from "express";

import {
    signup,
    sendOtp,
    verifyOtp,
    googleLogin,
    forgotPassword,
    resetPassword,
    changePassword,
    login,
    listUsers,
} from "../controller/user.controller";

import { verifyJWT } from "../middlewares/jwtVerify";

import {
    validateRequest,
    validateQuery,
} from "../validations/validation";

import {
    signupValidation,
    loginValidation,
    sendOtpValidation,
    verifySignupOtpValidation,
    googleLoginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    listUsersValidation,
} from "../validations/user.validation";


const router = express.Router();

router.post("/signup", validateRequest(signupValidation), signup);
router.post("/login", validateRequest(loginValidation), login);
router.post(
    "/login/google",
    validateRequest(googleLoginValidation),
    googleLogin
);

router.post("/send-otp", validateRequest(sendOtpValidation), sendOtp);
router.post("/verify-otp", validateRequest(verifySignupOtpValidation), verifyOtp);

router.post(
    "/forgot-password",
    validateRequest(forgotPasswordValidation),
    forgotPassword
);

router.post(
    "/reset-password",
    validateRequest(resetPasswordValidation),
    resetPassword
);

router.post(
    "/change-password",
    verifyJWT,
    validateRequest(changePasswordValidation),
    changePassword
);

router.get(
    "/users",
    validateQuery(listUsersValidation),
    listUsers
);


export default router;
