"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_controller_1 = require("../controller/location.controller");
const jwtVerify_1 = require("../middlewares/jwtVerify");
const validation_1 = require("../validations/validation");
const location_validation_1 = require("../validations/location.validation");
const router = express_1.default.Router();
router.get("/nearby", jwtVerify_1.optionalVerifyJWT, (0, validation_1.validateQuery)(location_validation_1.nearbyLocationValidation), location_controller_1.getNearbyLocations);
router.get("/:id", jwtVerify_1.optionalVerifyJWT, (0, validation_1.validateParams)(location_validation_1.locationIdParamValidation), location_controller_1.getLocationById);
router.post("/", jwtVerify_1.verifyJWT, (0, validation_1.validateRequest)(location_validation_1.createLocationValidation), location_controller_1.createLocation);
router.patch("/:id", jwtVerify_1.verifyJWT, (0, validation_1.validateRequest)(location_validation_1.updateLocationValidation), location_controller_1.updateLocation);
router.delete("/:id", jwtVerify_1.verifyJWT, location_controller_1.deleteLocation);
exports.default = router;
//# sourceMappingURL=location.routes.js.map