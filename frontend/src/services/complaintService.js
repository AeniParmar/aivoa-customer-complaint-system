import api from "../api/axios";

export const saveComplaint = async (complaintData) => {
    const response = await api.post("/complaints", complaintData);
    return response.data;
};

export const getComplaints = async () => {
    const response = await api.get("/complaints");
    return response.data;
};

export const deleteComplaint = async (id) => {
    await api.delete(`/complaints/${id}`);
};