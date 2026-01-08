"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationIdParamValidation = exports.nearbyLocationValidation = exports.updateLocationValidation = exports.createLocationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
// common fields 
const latitude = joi_1.default.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be >= -90",
    "number.max": "Latitude must be <= 90",
});
const longitude = joi_1.default.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be >= -180",
    "number.max": "Longitude must be <= 180",
});
const addressLine = joi_1.default.string().min(5).max(255);
const area = joi_1.default.string().min(2).max(100);
const city = joi_1.default.string().min(2).max(100);
const state = joi_1.default.string().min(2).max(100);
const pincode = joi_1.default.string().pattern(/^[0-9]{6}$/);
const landmark = joi_1.default.string().min(2).max(150);
const visibility = joi_1.default.string().valid(enum_1.LocationVisibility.PUBLIC, enum_1.LocationVisibility.APPROXIMATE, enum_1.LocationVisibility.PRIVATE);
// create location validation
exports.createLocationValidation = joi_1.default.object({
    latitude: latitude,
    longitude: longitude,
    addressLine: addressLine.required(),
    city: city.required(),
    area: area.optional(),
    state: state.optional(),
    pincode: pincode.optional(),
    landmark: landmark.optional(),
    visibility: visibility.optional(),
}).options({ abortEarly: false });
// update location validation
exports.updateLocationValidation = joi_1.default.object({
    latitude: joi_1.default.number().min(-90).max(90).optional(),
    longitude: joi_1.default.number().min(-180).max(180).optional(),
    addressLine: addressLine.optional(),
    city: city.optional(),
    area: area.optional(),
    state: state.optional(),
    pincode: pincode.optional(),
    landmark: landmark.optional(),
    visibility: visibility.optional(),
}).options({ abortEarly: false });
// GET NEARBY LOCATIONS VALIDATION
exports.nearbyLocationValidation = joi_1.default.object({
    lat: joi_1.default.number().min(-90).max(90).required(),
    lng: joi_1.default.number().min(-180).max(180).required(),
    radius: joi_1.default.number().min(100).max(50000).optional(), // meters
}).options({ abortEarly: false });
// GET LOCATION BY ID PARAM VALIDATION
exports.locationIdParamValidation = joi_1.default.object({
    id: joi_1.default.string().length(24).hex().required(),
}).options({ abortEarly: false });
//# sourceMappingURL=location.validation.js.map