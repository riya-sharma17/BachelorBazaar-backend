"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleRoadDistance = void 0;
const axios_1 = __importDefault(require("axios"));
const getGoogleRoadDistance = async (origin, destination) => {
    const { data } = await axios_1.default.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
        params: {
            origins: `${origin.lat},${origin.lng}`,
            destinations: `${destination.lat},${destination.lng}`,
            units: "metric",
            key: process.env.GOOGLE_MAPS_API_KEY,
        },
    });
    if (data.status !== "OK" ||
        !data.rows?.length ||
        !data.rows[0].elements?.length ||
        data.rows[0].elements[0].status !== "OK") {
        console.error("GOOGLE DISTANCE ERROR:", data);
        throw new Error("GOOGLE_DISTANCE_FAILED");
    }
    const element = data.rows[0].elements[0];
    return {
        distanceKm: +(element.distance.value / 1000).toFixed(1),
        etaMinutes: Math.ceil(element.duration.value / 60),
    };
};
exports.getGoogleRoadDistance = getGoogleRoadDistance;
//# sourceMappingURL=google.distance.js.map