import Joi from "joi";
import {
  ProductCategory,
  ProductCondition,
  ProductListingType,
  ProductStatus,
} from "../utils/enum";

// common fields
const title = Joi.string().min(3).max(100).trim();
const description = Joi.string().min(5).max(500).trim();
const price = Joi.number().positive();
const category = Joi.string().valid(...Object.values(ProductCategory));
const condition = Joi.string().valid(...Object.values(ProductCondition));
const listingType = Joi.string().valid(...Object.values(ProductListingType));
const status = Joi.string().valid(...Object.values(ProductStatus));
const objectId = Joi.string().length(24).hex();
const isAvailable = Joi.boolean();

//  location object validation
const locationSchema = Joi.object({
  addressLine: Joi.string().min(5).max(200).required(),
  area: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  geo: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array()
      .ordered(
        Joi.number().min(-180).max(180), // lng
        Joi.number().min(-90).max(90)    // lat
      )
      .required(),
  }).required(),
});

// create product validation
export const createProductValidation = Joi.object({
  title: title.required(),
  description: description.optional(),
  price: price.required(),
  category: category.required(),
  condition: condition.optional(),
  listingType: listingType.required(),

  // either one of these
  locationId: objectId.optional(),
  location: locationSchema.optional(),
})
  .xor("locationId", "location")
  .options({ abortEarly: false });

// update product validation
export const updateProductValidation = Joi.object({
  title: title.optional(),
  description: description.optional(),
  price: price.optional(),
  category: category.optional(),
  condition: condition.optional(),
  listingType: listingType.optional(),
  isAvailable: isAvailable.optional(),
}).min(1)
  .options({ abortEarly: false });

// product ID param validation
export const productIdParamValidation = Joi.object({
  id: objectId.required(),
}).options({ abortEarly: false });

// get all products validation
export const getProductsValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(10),
  category: Joi.string().valid(...Object.values(ProductCategory)).optional(),
  listingType: Joi.string()
    .valid(...Object.values(ProductListingType))
    .optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
}).options({ abortEarly: false });

// nearby products validation
export const nearbyProductsValidation = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(500).max(50000).optional(),
}).options({ abortEarly: false });
