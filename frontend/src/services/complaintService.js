import api from "../api/axios";

export const saveComplaint = async (complaintData, options = {}) => {
    const forceSave = options.forceSave || false;
    const response = await api.post("/complaints", {
        ...complaintData,
        force_save: forceSave,
    });
    return response.data;
};

export const getComplaints = async () => {
    const response = await api.get("/complaints");
    return response.data;
};

export const deleteComplaint = async (id) => {
    await api.delete(`/complaints/${id}`);
};