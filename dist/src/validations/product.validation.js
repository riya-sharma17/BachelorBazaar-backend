"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearbyProductsValidation = exports.productIdParamValidation = exports.updateProductValidation = exports.createProductValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
// common fields
const title = joi_1.default.string().min(3).max(100).trim();
const description = joi_1.default.string().min(5).max(500).trim();
const price = joi_1.default.number().positive();
const category = joi_1.default.string().valid(...Object.values(enum_1.ProductCategory));
const condition = joi_1.default.string().valid(...Object.values(enum_1.ProductCondition));
const listingType = joi_1.default.string().valid(...Object.values(enum_1.ProductListingType));
const status = joi_1.default.string().valid(...Object.values(enum_1.ProductStatus));
const objectId = joi_1.default.string().length(24).hex();
const isAvailable = joi_1.default.boolean();
// create product validation
exports.createProductValidation = joi_1.default.object({
    title: title.required(),
    description: description.optional(),
    price: price.required(),
    category: category.required(),
    condition: condition.optional(),
    listingType: listingType.required(),
    locationId: objectId.required(),
}).options({ abortEarly: false });
// update product validation
exports.updateProductValidation = joi_1.default.object({
    title: title.optional(),
    description: description.optional(),
    price: price.optional(),
    category: category.optional(),
    condition: condition.optional(),
    listingType: listingType.optional(),
    isAvailable: isAvailable.optional(),
    status: status.optional(),
}).options({ abortEarly: false });
// product ID param validation
exports.productIdParamValidation = joi_1.default.object({
    id: objectId.required(),
}).options({ abortEarly: false });
// nearby products validation
exports.nearbyProductsValidation = joi_1.default.object({
    lat: joi_1.default.number().min(-90).max(90).required(),
    lng: joi_1.default.number().min(-180).max(180).required(),
    radius: joi_1.default.number().min(500).max(50000).optional(),
}).options({ abortEarly: false });
//# sourceMappingURL=product.validation.js.map