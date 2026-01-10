import express from "express";

import {
  createProduct,
  getProductById,
  getNearbyProducts,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controller/product.controller";

import {
  validateRequest,
  validateParams,
  validateQuery,
} from "../validations/validation";

import {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
  nearbyProductsValidation,
  getProductsValidation,
} from "../validations/product.validation";

import {
  verifyJWT,
  optionalVerifyJWT,
} from "../middlewares/jwtVerify";

const router = express.Router();

router.get(
  "/nearby",
  optionalVerifyJWT,
  validateQuery(nearbyProductsValidation),
  getNearbyProducts
);

router.get(
  "/get-all",
  validateQuery(getProductsValidation),
  getProducts
);

router.get(
  "/:id",
  optionalVerifyJWT,
  validateParams(productIdParamValidation),
  getProductById
);

router.post(
  "/create",
  verifyJWT,
  validateRequest(createProductValidation),
  createProduct
);

router.patch(
  "/:id",
  verifyJWT,
  validateParams(productIdParamValidation),
  validateRequest(updateProductValidation),
  updateProduct
);

router.delete(
  "/:id",
  verifyJWT,
  validateParams(productIdParamValidation),
  deleteProduct
);

export default router;
