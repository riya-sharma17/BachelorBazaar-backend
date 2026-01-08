"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getNearbyProducts = exports.getProductById = exports.createProduct = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../model/product.model"));
const location_model_1 = __importDefault(require("../model/location.model"));
const message_1 = require("../utils/message");
const enum_1 = require("../utils/enum");
const createProduct = async (req, res, next) => {
    try {
        const sellerId = res.locals.user._id;
        const { title, description, price, category, condition, listingType, locationId, } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(locationId)) {
            return res.status(400).json({ message: message_1.ERROR_RESPONSE.INVALID_ID });
        }
        const location = await location_model_1.default.findById(locationId);
        if (!location) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }
        // 🔐 Seller must own location
        if (location.createdBy.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: message_1.ERROR_RESPONSE.UNAUTHORIZED,
            });
        }
        const product = await product_model_1.default.create({
            title,
            description,
            price,
            category,
            condition,
            listingType,
            location: locationId,
            seller: sellerId,
        });
        return res.status(201).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_CREATED,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await product_model_1.default
            .findById(id)
            .populate("seller", "name")
            .populate("location", "area city")
            .lean();
        if (!product) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.PRODUCT_NOT_FOUND,
            });
        }
        const seller = product.seller;
        const location = product.location;
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_FETCHED,
            data: {
                _id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                condition: product.condition,
                listingType: product.listingType,
                seller: {
                    name: seller.name,
                },
                location: {
                    area: location.area,
                    city: location.city,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const getNearbyProducts = async (req, res, next) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;
        const buyerLat = Number(lat);
        const buyerLng = Number(lng);
        if (!buyerLat || !buyerLng) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.INVALID_INPUT,
            });
        }
        const products = await product_model_1.default.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [buyerLng, buyerLat],
                    },
                    distanceField: "distance",
                    maxDistance: Number(radius),
                    spherical: true,
                    key: "location.geo",
                },
            },
            {
                $lookup: {
                    from: "locations",
                    localField: "location",
                    foreignField: "_id",
                    as: "location",
                },
            },
            { $unwind: "$location" },
            {
                $lookup: {
                    from: "users",
                    localField: "seller",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            { $unwind: "$seller" },
            {
                $project: {
                    title: 1,
                    price: 1,
                    category: 1,
                    condition: 1,
                    listingType: 1,
                    "location.area": 1,
                    "location.city": 1,
                    "seller.name": 1,
                    distance: 1,
                },
            },
        ]);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_FETCHED,
            data: products.map((p) => ({
                _id: p._id,
                title: p.title,
                price: p.price,
                category: p.category,
                condition: p.condition,
                listingType: p.listingType,
                seller: {
                    name: p.seller.name,
                },
                location: {
                    area: p.location.area,
                    city: p.location.city,
                },
                distanceKm: +(p.distance / 1000).toFixed(1),
                etaMinutes: Math.ceil((p.distance / 1000 / 20) * 60),
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getNearbyProducts = getNearbyProducts;
const updateProduct = async (req, res, next) => {
    try {
        const sellerId = res.locals.user._id;
        const { id } = req.params;
        const product = await product_model_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.PRODUCT_NOT_FOUND,
            });
        }
        if (product.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: message_1.ERROR_RESPONSE.UNAUTHORIZED,
            });
        }
        Object.assign(product, req.body);
        await product.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_UPDATED,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const sellerId = res.locals.user._id;
        const { id } = req.params;
        const product = await product_model_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.PRODUCT_NOT_FOUND,
            });
        }
        if (product.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: message_1.ERROR_RESPONSE.UNAUTHORIZED,
            });
        }
        product.status = enum_1.ProductStatus.DELETED;
        product.isAvailable = false;
        await product.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_DELETED,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map