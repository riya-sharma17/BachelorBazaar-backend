"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocation = exports.updateLocation = exports.getLocationById = exports.getNearbyLocations = exports.createLocation = void 0;
const location_model_1 = __importDefault(require("../model/location.model"));
const enum_1 = require("../utils/enum");
const message_1 = require("../utils/message");
const createLocation = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const { latitude, longitude, addressLine, area, city, state, pincode, landmark, visibility, } = req.body;
        const location = await location_model_1.default.create({
            geo: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            addressLine,
            area,
            city,
            state,
            pincode,
            landmark,
            visibility: visibility || enum_1.LocationVisibility.APPROXIMATE,
            createdBy: userId,
        });
        return res.status(201).json({
            message: message_1.SUCCESS_RESPONSE.LOCATION_CREATED,
            data: location,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLocation = createLocation;
const getNearbyLocations = async (req, res, next) => {
    try {
        const { lat, lng, radius = 3000 } = req.query;
        const locations = await location_model_1.default.find({
            geo: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)],
                    },
                    $maxDistance: Number(radius),
                },
            },
            visibility: { $ne: enum_1.LocationVisibility.PRIVATE },
        });
        const user = res.locals.user;
        const response = locations.map((loc) => {
            const isOwner = user && loc.createdBy.toString() === user._id.toString();
            if (!isOwner && loc.visibility !== enum_1.LocationVisibility.PUBLIC) {
                return blurLocation(loc);
            }
            return loc;
        });
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.LOCATION_FETCHED,
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getNearbyLocations = getNearbyLocations;
const getLocationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const location = await location_model_1.default.findById(id);
        if (!location) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }
        const isOwner = res.locals.user &&
            location.createdBy.toString() === res.locals.user._id.toString();
        if (!isOwner && location.visibility !== enum_1.LocationVisibility.PUBLIC) {
            return res.status(200).json({
                message: message_1.SUCCESS_RESPONSE.LOCATION_FETCHED,
                data: blurLocation(location),
            });
        }
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.LOCATION_FETCHED,
            data: location,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLocationById = getLocationById;
const updateLocation = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const { id } = req.params;
        const location = await location_model_1.default.findById(id);
        if (!location) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }
        if (location.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: message_1.ERROR_RESPONSE.UNAUTHORIZED,
            });
        }
        Object.assign(location, req.body);
        await location.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.LOCATION_UPDATED,
            data: location,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLocation = updateLocation;
const deleteLocation = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const { id } = req.params;
        const location = await location_model_1.default.findById(id);
        if (!location) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }
        if (location.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: message_1.ERROR_RESPONSE.UNAUTHORIZED,
            });
        }
        await location.deleteOne();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.LOCATION_DELETED,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLocation = deleteLocation;
const blurLocation = (location) => {
    const obj = location.toObject();
    const [lng, lat] = obj.geo.coordinates;
    obj.geo.coordinates = [
        Number(lng.toFixed(2)),
        Number(lat.toFixed(2)),
    ];
    delete obj.addressLine;
    delete obj.landmark;
    return obj;
};
//# sourceMappingURL=location.controller.js.map