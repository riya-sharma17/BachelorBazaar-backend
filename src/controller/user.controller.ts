import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import moment from "moment";
import userModel from "../model/user.model";
import { loginType } from "../utils/enum";
import { generateOTP, sendOTP } from "../utils/OTP";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import { OAuth2Client } from 'google-auth-library';


dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY in environment variables.");
}

const generateToken = (user: any) => {
    return jwt.sign(
        { _id: user._id, email: user.email, name: user.name },
        process.env.PRIVATE_KEY as string,
        { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as "1d") || "1d" }
    );
};

const sanitizeUser = (user: any) => {
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

const generateAndSendOTP = async (user: any) => {
    const otp = generateOTP();
    const otpExpires = moment().add(2, "minutes").toDate();
    
    user.OTP = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // CRITICAL: You must await this call in production
    try {
        await sendOTP(user.email, otp);
        console.log(`OTP ${otp} successfully dispatched to ${user.email}`);
    } catch (err) {
        console.error("Disruption in OTP delivery:", err);
        // Optional: you might want to throw here to inform the user
    }
};


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({
                message: ERROR_RESPONSE.EMAIL_ALREADY_REGISTERED,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: SUCCESS_RESPONSE.USER_REGISTERED,
            code: 201,
            data: sanitizeUser(user),
        });

    } catch (error) {
        next(error);
    }
};

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

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: ERROR_RESPONSE.EMAIL_REQUIRED });
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: ERROR_RESPONSE.USER_NOT_FOUND }); 
        }

        // Wait for the OTP to be generated, saved, and sent via HTTP API
        await generateAndSendOTP(user);

        return res.status(200).json({
            message: SUCCESS_RESPONSE.OTP_SENT,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: ERROR_RESPONSE.EMAIL_NOT_EXISTS,
            })
        }
        if (user.OTP !== otp) {
            return res.status(400).json({
                message: ERROR_RESPONSE.INVALID_OR_EXPIRED_OTP,
            });
        }

        if (!user.otpExpires || moment().isAfter(user.otpExpires)) {
            return res.status(400).json({
                message: ERROR_RESPONSE.INVALID_OR_EXPIRED_OTP,
            });
        }
        await user.save();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.OTP_VERIFIED,
            data: sanitizeUser(user),
        });
    } catch (error) {
        next(error);
    }
};

export const emailLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email });
        if (!user || !user.password) {
            return res.status(400).json({ message: ERROR_RESPONSE.INVALID_CREDENTIALS });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: ERROR_RESPONSE.INVALID_CREDENTIALS });
        }

        const token = generateToken(user);
        return res.status(200).json({
            message: SUCCESS_RESPONSE.LOGIN_SUCCESS,
            token,
            data: sanitizeUser(user),
        });
    } catch (error) {
        next(error);
    }
};

export const googleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                message: ERROR_RESPONSE.INVALID_CREDENTIALS,
            });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();


        if (!payload || !payload.email || !payload.sub) {
            return res.status(400).json({
                message: ERROR_RESPONSE.INVALID_CREDENTIALS,
            });
        }

        const googleId = payload.sub;
        const email = payload.email.toLowerCase().trim();
        const name = payload.name || email.split("@")[0];

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                name,
                email,
                loginType: loginType.GOOGLE,
                socialIds: [
                    {
                        id: googleId,
                        type: loginType.GOOGLE,
                        email,
                    },
                ],
            });
        } else {
            const alreadyLinked = user.socialIds?.some(
                (s) => s.id === googleId && s.type === loginType.GOOGLE
            );

            if (!alreadyLinked) {
                user.socialIds = user.socialIds || [];
                user.socialIds.push({
                    id: googleId,
                    type: loginType.GOOGLE,
                    email,
                });
                await user.save();
            }
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: SUCCESS_RESPONSE.GOOGLE_LOGIN_SUCCESS,
            token,
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: ERROR_RESPONSE.EMAIL_REQUIRED,
            });
        }

        const user = await userModel.findOne({
            email: email,
        });

        if (!user) {
            return res.status(200).json({
                message: SUCCESS_RESPONSE.OTP_SENT,
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: ERROR_RESPONSE.GOOGLE_ACCOUNT_NO_PASSWORD,
            });
        }

        await generateAndSendOTP(user);

        return res.status(200).json({
            message: SUCCESS_RESPONSE.OTP_SENT,
        });
    } catch (error) {
        next(error);
    }
};


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await userModel.findOne({ email });
        if (
            !user ||
            user.OTP !== otp ||
            !user.otpExpires ||
            moment().isAfter(user.otpExpires)
        ) {
            return res.status(400).json({
                message: ERROR_RESPONSE.INVALID_OR_EXPIRED_OTP,
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PASSWORD_RESET,
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user._id;
        const { oldPassword, newPassword } = req.body;

        const user = await userModel.findById(userId);
        if (!user || !user.password) {
            return res.status(404).json({
                message: ERROR_RESPONSE.USER_NOT_FOUND,
            });
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({
                message: ERROR_RESPONSE.OLD_PASSWORD_INCORRECT,
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PASSWORD_CHANGED,
        });
    } catch (error) {
        next(error);
    }
};

export const listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } },
            ];
        }

        const totalUsers = await userModel.countDocuments(query);

        const users = await userModel
            .find(query)
            .select("-password -OTP -otpExpires")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.USERS_FETCHED,
            data: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
                nextHit: page < Math.ceil(totalUsers / limit),
                users,
            },
        });
    } catch (error) {
        next(error);
    }
};

