// import type { Request, Response, NextFunction } from "express";
// import userModel from "../model/user.model";
// import jwt from "jsonwebtoken";
// import type { JwtPayload } from "jsonwebtoken";
// import * as dotenv from "dotenv";
// dotenv.config();

// interface DecodedToken extends JwtPayload {
//   _id: string; 
// }

// export const verifyJWT = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       res.status(401).json({
//         code: 401,
//         status: "failed",
//         message: "Unauthorized request: No token",
//       });
//       return;
//     }

//     const decodedToken = jwt.verify(
//       token,
//       process.env.PRIVATE_KEY as string
//     ) as DecodedToken;

//     const user = await userModel.findById(decodedToken._id);

//     if (!user) {
//       res.status(401).json({
//         code: 401,
//         status: "failed",
//         message: "Unauthorized request: User not found",
//       });
//       return;
//     }


//   res.locals.user = user;
//     next();
//   } catch (error: any) {
//     res.status(401).json({
//       status: "failed",
//       error: error?.message,
//       message: "Invalid Access Token",
//     });
//   }
// };

import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../model/user.model";

interface DecodedToken extends JwtPayload {
  _id: string;
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = jwt.verify(
      token,
      process.env.PRIVATE_KEY as string
    ) as DecodedToken;

    const user = await userModel.findById(decoded._id);

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
  } catch (error: any) {
    res.status(401).json({
      status: "failed",
      message: "Invalid Access Token",
    });
  }
};

export const optionalVerifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.PRIVATE_KEY as string
    );

    if (typeof decoded !== "object" || !("_id" in decoded)) {
      return next();
    }

    const user = await userModel.findById(
      (decoded as DecodedToken)._id
    );

    if (!user) {
      return next();
    }

    res.locals.user = user;
    return next();
  } catch {
    return next();
  }
};
