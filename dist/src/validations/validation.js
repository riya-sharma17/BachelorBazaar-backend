"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.body);
            req.body = result;
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: error.details[0]?.message,
            });
        }
    };
};
exports.validateRequest = validateRequest;
const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.query);
            req.query = result;
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: error?.details
                    ? error?.details[0]?.message
                    : "something went wrong",
            });
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.params);
            req.params = result;
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: error?.details
                    ? error?.details[0]?.message
                    : "something went wrong",
            });
        }
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validation.js.map