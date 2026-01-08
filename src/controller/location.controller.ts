import { Request, Response, NextFunction } from "express";
import locationModel from "../model/location.model";
import { LocationVisibility } from "../utils/enum";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";

export const createLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.user._id;
        const {
            latitude,
            longitude,
            addressLine,
            area,
            city,
            state,
            pincode,
            landmark,
            visibility,
        } = req.body;

        const location = await locationModel.create({
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
            visibility: visibility || LocationVisibility.APPROXIMATE,
            createdBy: userId,
        });

        return res.status(201).json({
            message: SUCCESS_RESPONSE.LOCATION_CREATED,
            data: location,
        });
    } catch (error) {
        next(error);
    }
};

export const getNearbyLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { lat, lng, radius = 3000 } = req.query;

        const locations = await locationModel.find({
            geo: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)],
                    },
                    $maxDistance: Number(radius),
                },
            },
            visibility: { $ne: LocationVisibility.PRIVATE },
        });

        const user = res.locals.user;

        const response = locations.map((loc) => {
            const isOwner =
                user && loc.createdBy.toString() === user._id.toString();

            if (!isOwner && loc.visibility !== LocationVisibility.PUBLIC) {
                return blurLocation(loc);
            }

            return loc;
        });

        return res.status(200).json({
            message: SUCCESS_RESPONSE.LOCATION_FETCHED,
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const getLocationById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const location = await locationModel.findById(id);

        if (!location) {
            return res.status(404).json({
                message: ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }

        const isOwner =
            res.locals.user &&
            location.createdBy.toString() === res.locals.user._id.toString();

        if (!isOwner && location.visibility !== LocationVisibility.PUBLIC) {
            return res.status(200).json({
                message: SUCCESS_RESPONSE.LOCATION_FETCHED,
                data: blurLocation(location),
            });
        }

        return res.status(200).json({
            message: SUCCESS_RESPONSE.LOCATION_FETCHED,
            data: location,
        });
    } catch (error) {
        next(error);
    }
};

export const updateLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.user._id;
        const { id } = req.params;

        const location = await locationModel.findById(id);

        if (!location) {
            return res.status(404).json({
                message: ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }

        if (location.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: ERROR_RESPONSE.UNAUTHORIZED,
            });
        }

        Object.assign(location, req.body);
        await location.save();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.LOCATION_UPDATED,
            data: location,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.user._id;
        const { id } = req.params;

        const location = await locationModel.findById(id);

        if (!location) {
            return res.status(404).json({
                message: ERROR_RESPONSE.LOCATION_NOT_FOUND,
            });
        }

        if (location.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: ERROR_RESPONSE.UNAUTHORIZED,
            });
        }

        await location.deleteOne();

        return res.status(200).json({
            message: SUCCESS_RESPONSE.LOCATION_DELETED,
        });
    } catch (error) {
        next(error);
    }
};

const blurLocation = (location: any) => {
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

