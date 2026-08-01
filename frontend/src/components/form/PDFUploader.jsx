import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button } from "@mui/material";

import { uploadPDF } from "../../services/pdfService";

function PDFUploader({
    setFormData,
    setAnalysisResult,
    setAIResult,
    setPdfAnalyzed,
}) {

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

            setAnalysisResult(result);

            setAIResult(result);

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