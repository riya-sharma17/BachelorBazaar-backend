import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
export declare const validateRequest: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateQuery: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateParams: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validation.d.ts.map