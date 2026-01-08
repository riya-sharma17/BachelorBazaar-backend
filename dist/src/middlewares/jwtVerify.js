"use strict";
// import type { Request, Response, NextFunction } from "express";
// import userModel from "../model/user.model";
// import jwt from "jsonwebtoken";
// import type { JwtPayload } from "jsonwebtoken";
// import * as dotenv from "dotenv";
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalVerifyJWT = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user.model"));
const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({
                code: 401,
                status: "failed",
                message: "Unauthorized request: No token",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
        const user = await user_model_1.default.findById(decoded._id);
        if (!user) {
            res.status(401).json({
                code: 401,
                status: "failed",
                message: "Unauthorized request: User not found",
            });
            return;
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            message: "Invalid Access Token",
        });
    }
};
exports.verifyJWT = verifyJWT;
const optionalVerifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next();
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
        if (typeof decoded !== "object" || !("_id" in decoded)) {
            return next();
        }
        const user = await user_model_1.default.findById(decoded._id);
        if (!user) {
            return next();
        }
        res.locals.user = user;
        return next();
    }
    catch {
        return next();
    }
};
exports.optionalVerifyJWT = optionalVerifyJWT;
//# sourceMappingURL=jwtVerify.js.map