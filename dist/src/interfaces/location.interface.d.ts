import { Document, Types } from "mongoose";
import { LocationVisibility } from "../utils/enum";
export interface ILocation extends Document {
    geo: {
        type: "Point";
        coordinates: [number, number];
    };
    addressLine: string;
    area?: string;
    city: string;
    state?: string;
    pincode?: string;
    landmark?: string;
    visibility: LocationVisibility;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=location.interface.d.ts.map