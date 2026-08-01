import api from "../api/axios";

export const analyzeComplaint = async (text) => {

    const response = await api.post("/ai/extract", {
        text,
    });

    return response.data;
};