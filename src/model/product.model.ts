import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";
import {
  ProductCategory,
  ProductCondition,
  ProductListingType,
  ProductStatus,
} from "../utils/enum";

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },

    condition: {
      type: String,
      enum: Object.values(ProductCondition),
      default: ProductCondition.USED,
    },

    listingType: {
      type: String,
      enum: Object.values(ProductListingType),
      required: true,
    },

    location: {
      type: Schema.Types.ObjectId,
      ref: "locations",
      required: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "products",
    versionKey: false,
  }
);

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ listingType: 1 });
productSchema.index({ isAvailable: 1 });

export default mongoose.model<IProduct>("products", productSchema);
