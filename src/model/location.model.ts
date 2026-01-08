import mongoose, { Schema } from "mongoose";
import { ILocation } from "../interfaces/location.interface";
import { LocationVisibility } from "../utils/enum";

const locationSchema: Schema<ILocation> = new Schema(
    {
        geo: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

        addressLine: {
            type: String,
            required: true,
        },

        area: String,
        city: { type: String, required: true },
        state: String,
        pincode: String,
        landmark: String,

        visibility: {
            type: String,
            enum: Object.values(LocationVisibility),
            default: LocationVisibility.APPROXIMATE,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "locations",
        versionKey: false,
    }
);

locationSchema.index({ geo: "2dsphere" });

export default mongoose.model<ILocation>("locations", locationSchema);
