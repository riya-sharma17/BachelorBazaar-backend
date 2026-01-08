import type { Request, Response, NextFunction } from "express";
export declare const verifyJWT: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalVerifyJWT: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=jwtVerify.d.ts.map