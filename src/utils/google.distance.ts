import axios from "axios";

export const getGoogleRoadDistance = async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
) => {
    const { data } = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
            params: {
                origins: `${origin.lat},${origin.lng}`,
                destinations: `${destination.lat},${destination.lng}`,
                units: "metric",
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        }
    );

    if (
        data.status !== "OK" ||
        !data.rows?.length ||
        !data.rows[0].elements?.length ||
        data.rows[0].elements[0].status !== "OK"
    ) {
        console.error("GOOGLE DISTANCE ERROR:", data);
        throw new Error("GOOGLE_DISTANCE_FAILED");
    }

    const element = data.rows[0].elements[0];

    return {
        distanceKm: +(element.distance.value / 1000).toFixed(1),
        etaMinutes: Math.ceil(element.duration.value / 60),
    };
};
