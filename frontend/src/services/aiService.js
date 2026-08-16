import api from "../api/axios";

export const analyzeComplaint = async (text) => {
    const response = await api.post("/ai/extract", {
        text,
    });

    return response.data;
};

export const updateComplaint = async (
    existingData,
    userInstruction
) => {
    const response = await api.post("/ai/update", {
        existing_data: existingData,
        user_instruction: userInstruction,
    });

    return response.data;
};