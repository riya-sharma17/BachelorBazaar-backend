"use strict";
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
exports.listUsers = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.googleLogin = exports.emailLogin = exports.verifyOtp = exports.sendOtp = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const user_model_1 = __importDefault(require("../model/user.model"));
const enum_1 = require("../utils/enum");
const OTP_1 = require("../utils/OTP");
const message_1 = require("../utils/message");
const google_auth_library_1 = require("google-auth-library");
dotenv.config();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY in environment variables.");
}
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, name: user.name }, process.env.PRIVATE_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" });
};
const sanitizeUser = (user) => {
    const obj = user.toObject();
    delete obj.password;
    delete obj.OTP;
    delete obj.otpExpires;
    return obj;
};
// const generateAndSendOTP = async (user: any) => {
//     const otp = generateOTP();
//     const otpExpires = moment().add(2, "minutes").toDate();
//     user.OTP = otp;
//     user.otpExpires = otpExpires;
//     await user.save();
//     sendOTP(user.email, otp).catch(err => {
//         console.error("OTP email failed:", err);
//     });
// };
const generateAndSendOTP = async (user) => {
    const otp = (0, OTP_1.generateOTP)();
    const otpExpires = (0, moment_1.default)().add(2, "minutes").toDate();
    user.OTP = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // CRITICAL: You must await this call in production
    try {
        await (0, OTP_1.sendOTP)(user.email, otp);
        console.log(`OTP ${otp} successfully dispatched to ${user.email}`);
    }
    catch (err) {
        console.error("Disruption in OTP delivery:", err);
        // Optional: you might want to throw here to inform the user
    }
};
const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const exists = await user_model_1.default.findOne({ email });
        if (exists) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.EMAIL_ALREADY_REGISTERED,
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: message_1.SUCCESS_RESPONSE.USER_REGISTERED,
            code: 201,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
// export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email } = req.body;
//         if (!email) {
//             return res.status(400).json({
//                 message: ERROR_RESPONSE.EMAIL_REQUIRED,
//             });
//         }
//         let user = await userModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({
//                 message: ERROR_RESPONSE.USER_NOT_FOUND,
//             }); 
//         }
//         await generateAndSendOTP(user);
//         return res.status(200).json({
//             message: SUCCESS_RESPONSE.OTP_SENT,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: message_1.ERROR_RESPONSE.EMAIL_REQUIRED });
        }
        let user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: message_1.ERROR_RESPONSE.USER_NOT_FOUND });
        }
        // Wait for the OTP to be generated, saved, and sent via HTTP API
        await generateAndSendOTP(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.OTP_SENT,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await user_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.EMAIL_NOT_EXISTS,
            });
        }
        if (user.OTP !== otp) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.INVALID_OR_EXPIRED_OTP,
            });
        }
        if (!user.otpExpires || (0, moment_1.default)().isAfter(user.otpExpires)) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.INVALID_OR_EXPIRED_OTP,
            });
        }
        await user.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.OTP_VERIFIED,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
const emailLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email: email });
        if (!user || !user.password) {
            return res.status(400).json({ message: message_1.ERROR_RESPONSE.INVALID_CREDENTIALS });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: message_1.ERROR_RESPONSE.INVALID_CREDENTIALS });
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.LOGIN_SUCCESS,
            token,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.emailLogin = emailLogin;
const googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.INVALID_CREDENTIALS,
            });
        }
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.sub) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.INVALID_CREDENTIALS,
            });
        }
        const googleId = payload.sub;
        const email = payload.email.toLowerCase().trim();
        const name = payload.name || email.split("@")[0];
        let user = await user_model_1.default.findOne({ email });
        if (!user) {
            user = await user_model_1.default.create({
                name,
                email,
                loginType: enum_1.loginType.GOOGLE,
                socialIds: [
                    {
                        id: googleId,
                        type: enum_1.loginType.GOOGLE,
                        email,
                    },
                ],
            });
        }
        else {
            const alreadyLinked = user.socialIds?.some((s) => s.id === googleId && s.type === enum_1.loginType.GOOGLE);
            if (!alreadyLinked) {
                user.socialIds = user.socialIds || [];
                user.socialIds.push({
                    id: googleId,
                    type: enum_1.loginType.GOOGLE,
                    email,
                });
                await user.save();
            }
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.GOOGLE_LOGIN_SUCCESS,
            token,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        console.error("Google Login Error:", error);
        next(error);
    }
};
exports.googleLogin = googleLogin;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.EMAIL_REQUIRED,
            });
        }
        const user = await user_model_1.default.findOne({
            email: email,
        });
        if (!user) {
            return res.status(200).json({
                message: message_1.SUCCESS_RESPONSE.OTP_SENT,
            });
        }
        if (!user.password) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.GOOGLE_ACCOUNT_NO_PASSWORD,
            });
        }
        await generateAndSendOTP(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.OTP_SENT,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user ||
            user.OTP !== otp ||
            !user.otpExpires ||
            (0, moment_1.default)().isAfter(user.otpExpires)) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.INVALID_OR_EXPIRED_OTP,
            });
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PASSWORD_RESET,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const { oldPassword, newPassword } = req.body;
        const user = await user_model_1.default.findById(userId);
        if (!user || !user.password) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.USER_NOT_FOUND,
            });
        }
        const match = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.OLD_PASSWORD_INCORRECT,
            });
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PASSWORD_CHANGED,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
const listUsers = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } },
            ];
        }
        const totalUsers = await user_model_1.default.countDocuments(query);
        const users = await user_model_1.default
            .find(query)
            .select("-password -OTP -otpExpires")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.USERS_FETCHED,
            data: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
                nextHit: page < Math.ceil(totalUsers / limit),
                users,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listUsers = listUsers;
//# sourceMappingURL=user.controller.js.map