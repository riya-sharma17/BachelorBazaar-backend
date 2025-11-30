import mongoose, { Schema } from "mongoose";
import { loginType } from "../utils/enum";
import { IUser } from "../interfaces/user.interface";

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },

        mobileNumber: {
            type: String,
            required: false
        },

        address: {
            type: String,
            required: false
        },

        password: {
            type: String,
            required: false,
        },
        OTP: {
            type: String,
            default: null,
        },
        otpExpires: {
            type: Date,
            default: null,
        },

        socialIds: [
            {
                id: { type: String, required: true },
                type: { type: String, enum: Object.values(loginType), required: true },
                email: { type: String, required: true },
            },
        ],
    },

    {
        timestamps: true,
        collection: "users",
        versionKey: false,
    }
);

const userModel = mongoose.model<IUser>("users", userSchema);
export default userModel;
