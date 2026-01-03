import axios from 'axios';

const AI_API_URL = 'http://localhost:8000'; // Adjust if your python server runs elsewhere

export const chatWithAI = async (message) => {
    try {
        const response = await axios.post(`${AI_API_URL}/chat`, { message });
        return response.data.response;
    } catch (error) {
        console.error("Error chatting with AI:", error);
        throw error;
    }
};

export const getRecommendations = async (userId) => {
    try {
        const response = await axios.get(`${AI_API_URL}/recommend/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};
