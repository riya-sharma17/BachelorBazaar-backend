import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import productModel from "../model/product.model";
import locationModel from "../model/location.model";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import { ProductStatus } from "../utils/enum";
import { getGoogleRoadDistance } from "../utils/google.distance";
interface PopulatedSeller {
    name: string;
}

interface PopulatedLocation {
    area: string;
    city: string;
}

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sellerId = res.locals.user._id;

        const {
            title,
            description,
            price,
            category,
            condition,
            listingType,
            locationId,
            location,
        } = req.body;

        let locationIdToUse: mongoose.Types.ObjectId;
        let locationGeoToUse;

        // CASE 1: Existing locationId
        if (locationId) {
            if (!mongoose.Types.ObjectId.isValid(locationId)) {
                return res.status(400).json({
                    message: ERROR_RESPONSE.INVALID_ID,
                });
            }

            const existingLocation = await locationModel.findById(locationId);

            if (!existingLocation) {
                return res.status(404).json({
                    message: ERROR_RESPONSE.LOCATION_NOT_FOUND,
                });
            }

            if (existingLocation.createdBy.toString() !== sellerId.toString()) {
                return res.status(403).json({
                    message: ERROR_RESPONSE.UNAUTHORIZED,
                });
            }

            locationIdToUse = existingLocation._id;
            locationGeoToUse = existingLocation.geo;
        }

        // CASE 2: New location object
        else if (location) {
            const newLocation = await locationModel.create({
                ...location,
                createdBy: sellerId,
            });

            locationIdToUse = newLocation._id;
            locationGeoToUse = newLocation.geo;
        }

        // CASE 3: No location provided
        else {
            return res.status(400).json({
                message: ERROR_RESPONSE.LOCATION_REQUIRED,
            });
        }

        // CREATE PRODUCT WITH locationGeo
        const product = await productModel.create({
            title,
            description,
            price,
            category,
            condition,
            listingType,
            location: locationIdToUse,
            locationGeo: locationGeoToUse,
            seller: sellerId,
            status: ProductStatus.ACTIVE,
            isAvailable: true,
        });

        return res.status(201).json({
            message: SUCCESS_RESPONSE.PRODUCT_CREATED,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const product = await productModel
            .findOne({
                _id: id,
                status: ProductStatus.ACTIVE,
                isAvailable: true,
            })
            .populate("seller", "name")
            .populate("location", "area city")
            .lean();

        if (!product) {
            return res.status(404).json({
                message: ERROR_RESPONSE.PRODUCT_NOT_FOUND,
            });
        }

        const seller = product.seller as unknown as PopulatedSeller;
        const location = product.location as unknown as PopulatedLocation;

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PRODUCT_FETCHED,
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
    } catch (error) {
        next(error);
    }
};

export const getNearbyProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;

        const buyerLat = Number(lat);
        const buyerLng = Number(lng);

        if (isNaN(buyerLat) || isNaN(buyerLng)) {
            return res.status(400).json({
                message: ERROR_RESPONSE.INVALID_INPUT,
            });
        }

        const products = await productModel.aggregate([
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
                    status: ProductStatus.ACTIVE,
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

        const enrichedProducts = await Promise.all(
            topProducts.map(async (p: any) => {
                const googleData = await getGoogleRoadDistance(
                    { lat: buyerLat, lng: buyerLng },
                    {
                        lat: p.locationGeo.coordinates[1],
                        lng: p.locationGeo.coordinates[0],
                    }
                );

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
            })
        );

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PRODUCT_FETCHED,
            data: enrichedProducts,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sellerId = res.locals.user._id;
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: ERROR_RESPONSE.PRODUCT_NOT_FOUND,
            });
        }

        if (product.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: ERROR_RESPONSE.UNAUTHORIZED,
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
                (product as any)[field] = req.body[field];
            }
        });

        await product.save();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PRODUCT_UPDATED,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sellerId = res.locals.user._id;
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: ERROR_RESPONSE.PRODUCT_NOT_FOUND,
            });
        }

        if (product.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: ERROR_RESPONSE.UNAUTHORIZED,
            });
        }

        product.status = ProductStatus.DELETED;
        product.isAvailable = false;
        await product.save();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PRODUCT_DELETED,
        });
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            listingType,
            minPrice,
            maxPrice,
        } = req.query as any;

        const skip = (page - 1) * limit;

        const filter: any = {
            status: ProductStatus.ACTIVE,
            isAvailable: true,
        };

        if (category) filter.category = category;
        if (listingType) filter.listingType = listingType;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const [products, total] = await Promise.all([
            productModel
                .find(filter)
                .populate("location", "area city")
                .populate("seller", "name")
                .sort({ createdAt: -1 })
                .skip(Number(skip))
                .limit(Number(limit))
                .lean(),

            productModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            message: SUCCESS_RESPONSE.PRODUCT_FETCHED,
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
                    name: (p.seller as any).name,
                },
                location: {
                    area: (p.location as any).area,
                    city: (p.location as any).city,
                },
            })),
        });
    } catch (error) {
        next(error);
    }
};

