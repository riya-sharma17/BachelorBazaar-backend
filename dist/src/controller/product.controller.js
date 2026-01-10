"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.getNearbyProducts = exports.getProductById = exports.createProduct = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../model/product.model"));
const location_model_1 = __importDefault(require("../model/location.model"));
const message_1 = require("../utils/message");
const enum_1 = require("../utils/enum");
const google_distance_1 = require("../utils/google.distance");
const createProduct = async (req, res, next) => {
    try {
        const sellerId = res.locals.user._id;
        const { title, description, price, category, condition, listingType, locationId, location, } = req.body;
        let locationIdToUse;
        let locationGeoToUse;
        // CASE 1: Existing locationId
        if (locationId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(locationId)) {
                return res.status(400).json({
                    message: message_1.ERROR_RESPONSE.INVALID_ID,
                });
            }
            const existingLocation = await location_model_1.default.findById(locationId);
            if (!existingLocation) {
                return res.status(404).json({
                    message: message_1.ERROR_RESPONSE.LOCATION_NOT_FOUND,
                });
            }
            if (existingLocation.createdBy.toString() !== sellerId.toString()) {
                return res.status(403).json({
                    message: message_1.ERROR_RESPONSE.UNAUTHORIZED,
                });
            }
            locationIdToUse = existingLocation._id;
            locationGeoToUse = existingLocation.geo;
        }
        // CASE 2: New location object
        else if (location) {
            const newLocation = await location_model_1.default.create({
                ...location,
                createdBy: sellerId,
            });
            locationIdToUse = newLocation._id;
            locationGeoToUse = newLocation.geo;
        }
        // CASE 3: No location provided
        else {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.LOCATION_REQUIRED,
            });
        }
        // CREATE PRODUCT WITH locationGeo
        const product = await product_model_1.default.create({
            title,
            description,
            price,
            category,
            condition,
            listingType,
            location: locationIdToUse,
            locationGeo: locationGeoToUse,
            seller: sellerId,
            status: enum_1.ProductStatus.ACTIVE,
            isAvailable: true,
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
            .findOne({
            _id: id,
            status: enum_1.ProductStatus.ACTIVE,
            isAvailable: true,
        })
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
        if (isNaN(buyerLat) || isNaN(buyerLng)) {
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
                    key: "locationGeo",
                },
            },
            {
                $match: {
                    status: enum_1.ProductStatus.ACTIVE,
                    isAvailable: true,
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
                    locationGeo: 1,
                    "location.area": 1,
                    "location.city": 1,
                    "seller.name": 1,
                    distance: 1,
                },
            },
        ]);
        const MAX_GOOGLE_CALLS = 5;
        const topProducts = products.slice(0, MAX_GOOGLE_CALLS);
        const enrichedProducts = await Promise.all(topProducts.map(async (p) => {
            const googleData = await (0, google_distance_1.getGoogleRoadDistance)({ lat: buyerLat, lng: buyerLng }, {
                lat: p.locationGeo.coordinates[1],
                lng: p.locationGeo.coordinates[0],
            });
            return {
                _id: p._id,
                title: p.title,
                price: p.price,
                category: p.category,
                condition: p.condition,
                listingType: p.listingType,
                seller: { name: p.seller.name },
                location: {
                    area: p.location.area,
                    city: p.location.city,
                },
                distanceKm: googleData.distanceKm,
                etaMinutes: googleData.etaMinutes,
            };
        }));
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_FETCHED,
            data: enrichedProducts,
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
        const allowedUpdates = [
            "title",
            "description",
            "price",
            "category",
            "condition",
            "listingType",
            "isAvailable",
        ];
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });
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
const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, listingType, minPrice, maxPrice, } = req.query;
        const skip = (page - 1) * limit;
        const filter = {
            status: enum_1.ProductStatus.ACTIVE,
            isAvailable: true,
        };
        if (category)
            filter.category = category;
        if (listingType)
            filter.listingType = listingType;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        const [products, total] = await Promise.all([
            product_model_1.default
                .find(filter)
                .populate("location", "area city")
                .populate("seller", "name")
                .sort({ createdAt: -1 })
                .skip(Number(skip))
                .limit(Number(limit))
                .lean(),
            product_model_1.default.countDocuments(filter),
        ]);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.PRODUCT_FETCHED,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: products.map((p) => ({
                _id: p._id,
                title: p.title,
                price: p.price,
                category: p.category,
                listingType: p.listingType,
                seller: {
                    name: p.seller.name,
                },
                location: {
                    area: p.location.area,
                    city: p.location.city,
                },
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
//# sourceMappingURL=product.controller.js.map