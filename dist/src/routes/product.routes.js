"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controller/product.controller");
const validation_1 = require("../validations/validation");
const product_validation_1 = require("../validations/product.validation");
const jwtVerify_1 = require("../middlewares/jwtVerify");
const router = express_1.default.Router();
router.get("/nearby", jwtVerify_1.optionalVerifyJWT, (0, validation_1.validateQuery)(product_validation_1.nearbyProductsValidation), product_controller_1.getNearbyProducts);
router.get("/get-all", (0, validation_1.validateQuery)(product_validation_1.getProductsValidation), product_controller_1.getProducts);
router.get("/:id", jwtVerify_1.optionalVerifyJWT, (0, validation_1.validateParams)(product_validation_1.productIdParamValidation), product_controller_1.getProductById);
router.post("/create", jwtVerify_1.verifyJWT, (0, validation_1.validateRequest)(product_validation_1.createProductValidation), product_controller_1.createProduct);
router.patch("/:id", jwtVerify_1.verifyJWT, (0, validation_1.validateParams)(product_validation_1.productIdParamValidation), (0, validation_1.validateRequest)(product_validation_1.updateProductValidation), product_controller_1.updateProduct);
router.delete("/:id", jwtVerify_1.verifyJWT, (0, validation_1.validateParams)(product_validation_1.productIdParamValidation), product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map