import api from "../api/axios";

export const uploadPDF = async (file) => {

    const formData = new FormData();

    formData.append("pdf_file", file);

    const response = await api.post(
        "/ai/upload-pdf",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};