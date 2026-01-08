
export enum loginType {
  EMAIL = "email",
  GOOGLE = "google",
  MOBILE = "mobile"
};

export enum Role {
  USER = "0",
  ADMIN = "1",

}

export enum LocationVisibility {
  PUBLIC = "public",
  APPROXIMATE = "approx",
  PRIVATE = "private",
}

export enum ProductCategory {
  FURNITURE = "furniture",
  KITCHEN = "kitchen",
  ELECTRONICS = "electronics",
  ROOM_ESSENTIALS = "room_essentials",
  CLEANING = "cleaning",
  STUDY_WORK = "study_work",
  BATHROOM = "bathroom",
  DAILY_USE = "daily_use",
  LIFESTYLE = "lifestyle",
}

export enum ProductSubCategory {
  // Furniture
  BED = "bed",
  MATTRESS = "mattress",
  TABLE = "table",
  CHAIR = "chair",
  WARDROBE = "wardrobe",

  // Kitchen
  STOVE = "stove",
  UTENSILS = "utensils",
  COOKER = "cooker",

  // Electronics
  FRIDGE = "fridge",
  WASHING_MACHINE = "washing_machine",
  MICROWAVE = "microwave",
  IRON = "iron",

  // Study / Work
  LAPTOP_TABLE = "laptop_table",
  EXTENSION_BOARD = "extension_board",
  LAMP = "lamp",

  // Bathroom
  GEYSER = "geyser",
  MIRROR = "mirror",

  // Lifestyle
  BEAN_BAG = "bean_bag",
  SPEAKER = "speaker",
}

export enum ProductListingType {
  SELL = "sell",
  RENT = "rent",
  FREE = "free",
}

export enum ProductCondition {
  NEW = "new",
  LIKE_NEW = "like_new",
  USED = "used",
  HEAVILY_USED = "heavily_used",
}

export enum SellerType {
  INDIVIDUAL = "individual",
  SHOP = "shop",
}

export enum ProductStatus {
  ACTIVE = "active",
  SOLD = "sold",
  RENTED = "rented",
  INACTIVE = "inactive",
  DELETED = "deleted",
}
