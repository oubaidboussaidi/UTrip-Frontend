import axios from 'axios';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export const getCoordinates = async (query) => {
    try {
        // Append "Tunisia" to context if needed to restrict search, 
        // assuming the app is for Tunisia tourism based on previous context ("Tunis", etc)
        const searchQuery = `${query}, Tunisia`;

        const response = await axios.get(NOMINATIM_BASE_URL, {
            params: {
                q: searchQuery,
                format: "json",
                limit: 1,
            }
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};
