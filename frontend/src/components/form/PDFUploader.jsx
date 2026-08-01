import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button } from "@mui/material";

import { useDispatch } from "react-redux";

import { setAIResult } from "../../redux/complaintSlice";
import { uploadPDF } from "../../services/pdfService";

function PDFUploader({
    setFormData,
    setPdfAnalyzed,
}) {

    const dispatch = useDispatch();

    const handleUpload = async (event) => {

        const file = event.target.files[0];

        if (!file) return;

        try {

            const result = await uploadPDF(file);

            setFormData({
                customer_name: result.customer_name || "",
                customer_email: result.customer_email || "",
                customer_phone: "",
                product_name: result.product_name || "",
                batch_number: result.batch_number || "",
                quantity: result.quantity || "",
                complaint_description:
                    result.complaint_description || "",
            });

            dispatch(setAIResult(result));

            setPdfAnalyzed(true);

        } catch (error) {

            console.error(error);

            alert("PDF Upload Failed");

        }

    };

    return (

        <Button
            component="label"
            variant="contained"
            startIcon={<UploadFileIcon />}
        >

            Upload PDF

            <input
                hidden
                type="file"
                accept=".pdf"
                onChange={handleUpload}
            />

        </Button>

    );

}

export default PDFUploader;