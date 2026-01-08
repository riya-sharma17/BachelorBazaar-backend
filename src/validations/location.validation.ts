import Joi from "joi";
import { LocationVisibility } from "../utils/enum";

// common fields 
const latitude = Joi.number()
  .min(-90)
  .max(90)
  .required()
  .messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be >= -90",
    "number.max": "Latitude must be <= 90",
  });

const longitude = Joi.number()
  .min(-180)
  .max(180)
  .required()
  .messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be >= -180",
    "number.max": "Longitude must be <= 180",
  });

const addressLine = Joi.string().min(5).max(255);
const area = Joi.string().min(2).max(100);
const city = Joi.string().min(2).max(100);
const state = Joi.string().min(2).max(100);
const pincode = Joi.string().pattern(/^[0-9]{6}$/);
const landmark = Joi.string().min(2).max(150);

const visibility = Joi.string().valid(
  LocationVisibility.PUBLIC,
  LocationVisibility.APPROXIMATE,
  LocationVisibility.PRIVATE
);

// create location validation
export const createLocationValidation = Joi.object({
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
export const updateLocationValidation = Joi.object({
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),

  addressLine: addressLine.optional(),
  city: city.optional(),
  area: area.optional(),
  state: state.optional(),
  pincode: pincode.optional(),
  landmark: landmark.optional(),

  visibility: visibility.optional(),
}).options({ abortEarly: false });

// GET NEARBY LOCATIONS VALIDATION
export const nearbyLocationValidation = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(100).max(50000).optional(), // meters
}).options({ abortEarly: false });


// GET LOCATION BY ID PARAM VALIDATION
export const locationIdParamValidation = Joi.object({
  id: Joi.string().length(24).hex().required(),
}).options({ abortEarly: false });
