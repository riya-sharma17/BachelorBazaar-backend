"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "";
        mongoose_1.default.set("debug", true);
        const conn = await mongoose_1.default.connect(uri);
        console.log("MongoDB connected:", conn.connection.host);
        return conn;
    }
    catch (error) {
        console.error(" MongoDB connection error:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=connection.js.map