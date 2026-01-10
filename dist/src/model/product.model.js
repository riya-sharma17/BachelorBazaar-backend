"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("../utils/enum");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(enum_1.ProductCategory),
        required: true,
    },
    condition: {
        type: String,
        enum: Object.values(enum_1.ProductCondition),
        default: enum_1.ProductCondition.USED,
    },
    listingType: {
        type: String,
        enum: Object.values(enum_1.ProductListingType),
        required: true,
    },
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "locations",
        required: true,
    },
    locationGeo: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            immutable: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            immutable: true,
        },
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(enum_1.ProductStatus),
        default: enum_1.ProductStatus.ACTIVE,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "products",
    versionKey: false,
});
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ listingType: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ locationGeo: "2dsphere" });
exports.default = mongoose_1.default.model("products", productSchema);
//# sourceMappingURL=product.model.js.map