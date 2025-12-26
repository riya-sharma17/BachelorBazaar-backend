"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const jwtVerify_1 = require("../middlewares/jwtVerify");
const validation_1 = require("../validations/validation");
const user_validation_1 = require("../validations/user.validation");
const router = express_1.default.Router();
router.post("/signup", (0, validation_1.validateRequest)(user_validation_1.signupValidation), user_controller_1.signup);
router.post("/login", (0, validation_1.validateRequest)(user_validation_1.loginValidation), user_controller_1.login);
router.post("/login/google", (0, validation_1.validateRequest)(user_validation_1.googleLoginValidation), user_controller_1.googleLogin);
router.post("/send-otp", (0, validation_1.validateRequest)(user_validation_1.sendOtpValidation), user_controller_1.sendOtp);
router.post("/verify-otp", (0, validation_1.validateRequest)(user_validation_1.verifySignupOtpValidation), user_controller_1.verifyOtp);
router.post("/forgot-password", (0, validation_1.validateRequest)(user_validation_1.forgotPasswordValidation), user_controller_1.forgotPassword);
router.post("/reset-password", (0, validation_1.validateRequest)(user_validation_1.resetPasswordValidation), user_controller_1.resetPassword);
router.post("/change-password", jwtVerify_1.verifyJWT, (0, validation_1.validateRequest)(user_validation_1.changePasswordValidation), user_controller_1.changePassword);
router.get("/users", (0, validation_1.validateQuery)(user_validation_1.listUsersValidation), user_controller_1.listUsers);
exports.default = router;
//# sourceMappingURL=user.routes.js.map