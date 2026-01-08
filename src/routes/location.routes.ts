import express from "express";

import {
  createLocation,
  getNearbyLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../controller/location.controller";

import {
  verifyJWT,
  optionalVerifyJWT,
} from "../middlewares/jwtVerify";

import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../validations/validation";

import {
  createLocationValidation,
  updateLocationValidation,
  nearbyLocationValidation,
  locationIdParamValidation,
} from "../validations/location.validation";

const router = express.Router();

router.get(
  "/nearby",
  optionalVerifyJWT,
  validateQuery(nearbyLocationValidation),
  getNearbyLocations
);

router.get(
  "/:id",
  optionalVerifyJWT,
  validateParams(locationIdParamValidation),
  getLocationById
);

router.post(
  "/",
  verifyJWT,
  validateRequest(createLocationValidation),
  createLocation
);

router.patch(
  "/:id",
  verifyJWT,
  validateRequest(updateLocationValidation),
  updateLocation
);

router.delete(
  "/:id",
  verifyJWT,
  deleteLocation
);

export default router;
