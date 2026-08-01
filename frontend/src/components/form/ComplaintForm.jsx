import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearAIResult,
    setAIResult,
} from "../../redux/complaintSlice";
import {
    Alert,
    Box,
    Button,
    Divider,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { analyzeComplaint } from "../../services/aiService";
import { saveComplaint } from "../../services/complaintService";
import PDFUploader from "./PDFUploader";
function ComplaintForm({
    setRefreshTrigger,
}) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const dispatch = useDispatch();
    const analysisResult = useSelector(
        (state) => state.complaint.aiResult
    );
    const [pdfAnalyzed, setPdfAnalyzed] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        product_name: "",
        batch_number: "",
        quantity: "",
        complaint_description: "",
    });
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
        if (pdfAnalyzed) {
            setPdfAnalyzed(false);
        }
    };
    const handleAnalyze = async () => {
        try {
            setLoading(true);
            const prompt = `
Customer Name: ${formData.customer_name}
Customer Email: ${formData.customer_email}
Customer Phone: ${formData.customer_phone}
Product Name: ${formData.product_name}
Batch Number: ${formData.batch_number}
Quantity: ${formData.quantity}
Complaint Description:
${formData.complaint_description}
`;
            const result = await analyzeComplaint(prompt);
            console.log("AI Result:", result);
            dispatch(setAIResult(result));
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.log(error.response.data);
            }
            setSnackbar({
                open: true,
                message: "AI Analysis Failed",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!analysisResult) {
            setSnackbar({
                open: true,
                message: "Please analyze the complaint before saving.",
                severity: "warning",
            });
            return;
        }
        try {
            setSaving(true);
            const complaintData = {
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                product_name: formData.product_name,
                batch_number: formData.batch_number,
                quantity: Number(formData.quantity),
                complaint_description: formData.complaint_description,
                category: analysisResult.category || null,
                severity: analysisResult.severity || null,
                risk_assessment: analysisResult.risk_assessment || null,
                status: "open",
            };
            const savedComplaint = await saveComplaint(complaintData);
            console.log("Saved Complaint:", savedComplaint);
            setRefreshTrigger((prev) => prev + 1);
            setSnackbar({
                open: true,
                message: "Complaint saved successfully!",
                severity: "success",
            });
            setFormData({
                customer_name: "",
                customer_email: "",
                customer_phone: "",
                product_name: "",
                batch_number: "",
                quantity: "",
                complaint_description: "",
            });
            dispatch(clearAIResult());
            setPdfAnalyzed(false);
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.log(error.response.data);
                setSnackbar({
                    open: true,
                    message: error.response.data.detail || "Failed to save complaint.",
                    severity: "error",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Failed to save complaint.",
                    severity: "error",
                });
            }
        } finally {
            setSaving(false);
        }
    };
    return (
        <Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
            >
                Customer Complaint
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                mb={3}
            >
                Enter complaint information below.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box mb={3}>

                <PDFUploader
                    setFormData={setFormData}
                    setPdfAnalyzed={setPdfAnalyzed}
                />

                {pdfAnalyzed && (

                    <Typography
                        color="success.main"
                        fontWeight="bold"
                        mt={1}
                    >
                        ✅ PDF uploaded successfully. AI analysis completed automatically.
                    </Typography>

                )}

            </Box>

            <Stack spacing={2}>

                <TextField
                    label="Customer Name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Customer Email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Customer Phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Product Name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Batch Number"
                    name="batch_number"
                    value={formData.batch_number}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Complaint Description"
                    name="complaint_description"
                    value={formData.complaint_description}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    fullWidth
                />

                <Stack
                    direction="row"
                    spacing={2}
                    mt={2}
                >

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleAnalyze}
                        disabled={loading || pdfAnalyzed}
                    >
                        {loading ? "Analyzing..." : "Analyze with AI"}
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Complaint"}
                    </Button>

                </Stack>

            </Stack>

        </Box>

    );
}
export default ComplaintForm;