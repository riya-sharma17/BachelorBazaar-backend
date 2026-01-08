import { Document, Types } from "mongoose";
import { ProductCategory, ProductCondition, ProductListingType, ProductStatus } from "../utils/enum";
export interface IProduct extends Document {
    title: string;
    description?: string;
    price: number;
    category: ProductCategory;
    condition: ProductCondition;
    listingType: ProductListingType;
    location: Types.ObjectId;
    seller: Types.ObjectId;
    status: ProductStatus;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=product.interface.d.ts.map