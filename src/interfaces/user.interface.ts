import { loginType } from "../utils/enum";

interface SocialId {
    id: string;
    type: loginType;
    email: string;
}

export interface IUser extends Document {
    name: string;
    password: string;
    mobileNumber: string;
    address: string;
    loginType: loginType;
    email: string;
    OTP?: string;
    otpExpires?: Date;
    socialIds?: SocialId[];
    createdAt: Date;
}