"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.SellerType = exports.ProductCondition = exports.ProductListingType = exports.ProductSubCategory = exports.ProductCategory = exports.LocationVisibility = exports.Role = exports.loginType = void 0;
var loginType;
(function (loginType) {
    loginType["EMAIL"] = "email";
    loginType["GOOGLE"] = "google";
    loginType["MOBILE"] = "mobile";
})(loginType || (exports.loginType = loginType = {}));
;
var Role;
(function (Role) {
    Role["USER"] = "0";
    Role["ADMIN"] = "1";
})(Role || (exports.Role = Role = {}));
var LocationVisibility;
(function (LocationVisibility) {
    LocationVisibility["PUBLIC"] = "public";
    LocationVisibility["APPROXIMATE"] = "approx";
    LocationVisibility["PRIVATE"] = "private";
})(LocationVisibility || (exports.LocationVisibility = LocationVisibility = {}));
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["FURNITURE"] = "furniture";
    ProductCategory["KITCHEN"] = "kitchen";
    ProductCategory["ELECTRONICS"] = "electronics";
    ProductCategory["ROOM_ESSENTIALS"] = "room_essentials";
    ProductCategory["CLEANING"] = "cleaning";
    ProductCategory["STUDY_WORK"] = "study_work";
    ProductCategory["BATHROOM"] = "bathroom";
    ProductCategory["DAILY_USE"] = "daily_use";
    ProductCategory["LIFESTYLE"] = "lifestyle";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductSubCategory;
(function (ProductSubCategory) {
    // Furniture
    ProductSubCategory["BED"] = "bed";
    ProductSubCategory["MATTRESS"] = "mattress";
    ProductSubCategory["TABLE"] = "table";
    ProductSubCategory["CHAIR"] = "chair";
    ProductSubCategory["WARDROBE"] = "wardrobe";
    // Kitchen
    ProductSubCategory["STOVE"] = "stove";
    ProductSubCategory["UTENSILS"] = "utensils";
    ProductSubCategory["COOKER"] = "cooker";
    // Electronics
    ProductSubCategory["FRIDGE"] = "fridge";
    ProductSubCategory["WASHING_MACHINE"] = "washing_machine";
    ProductSubCategory["MICROWAVE"] = "microwave";
    ProductSubCategory["IRON"] = "iron";
    // Study / Work
    ProductSubCategory["LAPTOP_TABLE"] = "laptop_table";
    ProductSubCategory["EXTENSION_BOARD"] = "extension_board";
    ProductSubCategory["LAMP"] = "lamp";
    // Bathroom
    ProductSubCategory["GEYSER"] = "geyser";
    ProductSubCategory["MIRROR"] = "mirror";
    // Lifestyle
    ProductSubCategory["BEAN_BAG"] = "bean_bag";
    ProductSubCategory["SPEAKER"] = "speaker";
})(ProductSubCategory || (exports.ProductSubCategory = ProductSubCategory = {}));
var ProductListingType;
(function (ProductListingType) {
    ProductListingType["SELL"] = "sell";
    ProductListingType["RENT"] = "rent";
    ProductListingType["FREE"] = "free";
})(ProductListingType || (exports.ProductListingType = ProductListingType = {}));
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "new";
    ProductCondition["LIKE_NEW"] = "like_new";
    ProductCondition["USED"] = "used";
    ProductCondition["HEAVILY_USED"] = "heavily_used";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
var SellerType;
(function (SellerType) {
    SellerType["INDIVIDUAL"] = "individual";
    SellerType["SHOP"] = "shop";
})(SellerType || (exports.SellerType = SellerType = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["SOLD"] = "sold";
    ProductStatus["RENTED"] = "rented";
    ProductStatus["INACTIVE"] = "inactive";
    ProductStatus["DELETED"] = "deleted";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
//# sourceMappingURL=enum.js.map