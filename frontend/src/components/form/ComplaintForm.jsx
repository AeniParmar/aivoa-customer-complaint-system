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
    Grid,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { analyzeComplaint } from "../../services/aiService";
import { saveComplaint } from "../../services/complaintService";

import ConfirmDialog from "../common/ConfirmDialog";
import AICopilot from "../ai/AICopilot";
import PDFUploader from "./PDFUploader";


function ComplaintForm({
    setRefreshTrigger,
}) {

    const dispatch = useDispatch();

    const analysisResult = useSelector(
        (state) => state.complaint.aiResult
    );

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [pdfAnalyzed, setPdfAnalyzed] = useState(false);

    const [duplicateInfo, setDuplicateInfo] =
        useState(null);

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


    /* =========================
       FORM CHANGE
    ========================= */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (pdfAnalyzed) {
            setPdfAnalyzed(false);
        }
    };


    /* =========================
       AI ANALYSIS
    ========================= */

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

            const result =
                await analyzeComplaint(prompt);

            console.log(
                "AI Result:",
                result
            );

            dispatch(
                setAIResult(result)
            );

        } catch (error) {

            console.error(error);

            if (error.response) {
                console.log(
                    error.response.data
                );
            }

            setSnackbar({
                open: true,
                message:
                    "AI Analysis Failed",
                severity: "error",
            });

        } finally {

            setLoading(false);

        }
    };


    /* =========================
       SAVE COMPLAINT
    ========================= */

    const handleSave = async (
        forceSave = false
    ) => {

        if (!analysisResult) {

            setSnackbar({
                open: true,
                message:
                    "Please analyze the complaint before saving.",
                severity: "warning",
            });

            return;
        }


        try {

            setSaving(true);


            const complaintData = {

                customer_name:
                    formData.customer_name,

                customer_email:
                    formData.customer_email,

                product_name:
                    formData.product_name,

                batch_number:
                    formData.batch_number,

                quantity:
                    Number(formData.quantity),

                complaint_description:
                    formData.complaint_description,

                category:
                    analysisResult.category ||
                    null,

                severity:
                    analysisResult.severity ||
                    null,

                risk_assessment:
                    analysisResult.risk_assessment ||
                    null,

                status: "open",
            };


            const savedComplaint =
                await saveComplaint(
                    complaintData,
                    { forceSave }
                );


            console.log(
                "Saved Complaint:",
                savedComplaint
            );


            if (setRefreshTrigger) {

                setRefreshTrigger(
                    (prev) => prev + 1
                );

            }


            setSnackbar({
                open: true,
                message:
                    "Complaint saved successfully!",
                severity: "success",
            });


            /* Clear form */

            setFormData({
                customer_name: "",
                customer_email: "",
                customer_phone: "",
                product_name: "",
                batch_number: "",
                quantity: "",
                complaint_description: "",
            });


            dispatch(
                clearAIResult()
            );


            setPdfAnalyzed(false);

            setDuplicateInfo(null);


        } catch (error) {

            console.error(error);


            if (error.response) {

                console.log(
                    error.response.data
                );


                /* Duplicate complaint */

                if (
                    error.response.status ===
                    409
                ) {

                    const detail =
                        error.response.data
                            ?.detail;


                    setDuplicateInfo(
                        detail?.duplicate || {
                            message:
                                detail ||
                                "Duplicate complaint detected",
                        }
                    );

                }

                /* Other server error */

                else {

                    setSnackbar({
                        open: true,
                        message:
                            error.response.data
                                ?.detail ||
                            "Failed to save complaint.",
                        severity: "error",
                    });

                }

            }

            /* Network error */

            else {

                setSnackbar({
                    open: true,
                    message:
                        "Failed to save complaint.",
                    severity: "error",
                });

            }

        } finally {

            setSaving(false);

        }
    };


    /* =========================
       COPILOT UPDATE
    ========================= */

    const handleCopilotUpdate = (
        updatedData
    ) => {

        setFormData((prev) => ({

            ...prev,

            customer_name:
                updatedData.customer_name ??
                prev.customer_name,

            customer_email:
                updatedData.customer_email ??
                prev.customer_email,

            customer_phone:
                updatedData.customer_phone ??
                prev.customer_phone,

            product_name:
                updatedData.product_name ??
                prev.product_name,

            batch_number:
                updatedData.batch_number ??
                prev.batch_number,

            quantity:
                updatedData.quantity ??
                prev.quantity,

            complaint_description:
                updatedData.complaint_description ??
                prev.complaint_description,

        }));


        /* Keep AI result synchronized */

        dispatch(
            setAIResult({

                ...(analysisResult || {}),

                ...updatedData,

            })
        );


        setPdfAnalyzed(false);
    };


    /* =========================
       UI
    ========================= */

    return (

        <Box>

            {/* =========================
                SNACKBAR
            ========================= */}

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
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>


            {/* =========================
                HEADER
            ========================= */}

            <Box sx={{ mb: 2 }}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        fontSize: {
                            xs: "1.35rem",
                            md: "1.5rem",
                        },
                    }}
                >
                    Customer Complaint
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Capture complaint details and
                    generate AI-powered quality assessment.
                </Typography>

            </Box>


            <Divider sx={{ mb: 2 }} />


            {/* =========================
                PDF UPLOAD
            ========================= */}

            <Box sx={{ mb: 2.5 }}>

                <Box
                    sx={{
                        border: "1px dashed #b8c7dc",
                        borderRadius: 2,
                        p: 1.5,
                        backgroundColor:
                            "#f8fbff",
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1.5}
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                        justifyContent="space-between"
                    >

                        <Box>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                            >
                                Complaint Document
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Upload a PDF to automatically
                                extract complaint information.
                            </Typography>

                        </Box>


                        <PDFUploader
                            setFormData={
                                setFormData
                            }
                            setPdfAnalyzed={
                                setPdfAnalyzed
                            }
                        />

                    </Stack>


                    {pdfAnalyzed && (

                        <Alert
                            severity="success"
                            sx={{
                                mt: 1.2,
                                py: 0,
                            }}
                        >
                            PDF uploaded successfully.
                            AI analysis completed automatically.
                        </Alert>

                    )}

                </Box>

            </Box>


            {/* =========================
                FORM TITLE
            ========================= */}

            <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.secondary"
                sx={{ mb: 1 }}
            >
                Complaint Information
            </Typography>


            {/* =========================
                FORM FIELDS
            ========================= */}

            <Grid
                container
                spacing={1.5}
            >

                {/* Customer Name */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField
                        label="Customer Name"
                        name="customer_name"
                        value={
                            formData.customer_name
                        }
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />

                </Grid>


                {/* Email */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField
                        label="Customer Email"
                        name="customer_email"
                        value={
                            formData.customer_email
                        }
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />

                </Grid>


                {/* Phone */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField
                        label="Customer Phone"
                        name="customer_phone"
                        value={
                            formData.customer_phone
                        }
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />

                </Grid>


                {/* Product */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField
                        label="Product Name"
                        name="product_name"
                        value={
                            formData.product_name
                        }
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />

                </Grid>


                {/* Batch */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField
                        label="Batch Number"
                        name="batch_number"
                        value={
                            formData.batch_number
                        }
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />

                </Grid>


                {/* Quantity */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={
                            formData.quantity
                        }
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />

                </Grid>


                {/* Description */}

                <Grid
                    item
                    xs={12}
                >

                    <TextField
                        label="Complaint Description"
                        name="complaint_description"
                        value={
                            formData.complaint_description
                        }
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                    />

                </Grid>

            </Grid>


            {/* =========================
                ACTION BUTTONS
            ========================= */}

            <Stack
                direction="row"
                spacing={1.5}
                sx={{ mt: 1.8 }}
            >

                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleAnalyze}
                    disabled={
                        loading ||
                        pdfAnalyzed
                    }
                    sx={{
                        textTransform:
                            "none",
                        fontWeight: 600,
                    }}
                >

                    {loading
                        ? "Analyzing..."
                        : "Analyze with AI"}

                </Button>


                <Button
                    variant="outlined"
                    size="medium"
                    type="button"
                    onClick={() =>
                        handleSave()
                    }
                    disabled={saving}
                    sx={{
                        textTransform:
                            "none",
                        fontWeight: 600,
                    }}
                >

                    {saving
                        ? "Saving..."
                        : "Save Complaint"}

                </Button>

            </Stack>


            {/* =========================
                AIVOA COPILOT
            ========================= */}

            <Box
                sx={{
                    mt: 2,
                }}
            >

                <AICopilot
                    complaintData={{
                        ...formData,
                        ...(analysisResult || {}),
                    }}
                    onUpdate={
                        handleCopilotUpdate
                    }
                />

            </Box>


            {/* =========================
                DUPLICATE DIALOG
            ========================= */}

            <ConfirmDialog

                open={
                    Boolean(
                        duplicateInfo
                    )
                }

                title="Duplicate Complaint Detected"

                message={
                    "A complaint with the same customer, product, and batch number already exists."
                }

                confirmLabel="Save Anyway"

                cancelLabel="Cancel"

                confirmColor="warning"


                onCancel={() =>
                    setDuplicateInfo(null)
                }


                onConfirm={() => {

                    setDuplicateInfo(
                        null
                    );

                    handleSave(true);

                }}

            >

                <Stack
                    spacing={1}
                    sx={{ mt: 2 }}
                >

                    <Typography>

                        <b>
                            Customer Name:
                        </b>{" "}

                        {
                            duplicateInfo
                                ?.customer_name ||
                            "—"
                        }

                    </Typography>


                    <Typography>

                        <b>
                            Product Name:
                        </b>{" "}

                        {
                            duplicateInfo
                                ?.product_name ||
                            "—"
                        }

                    </Typography>


                    <Typography>

                        <b>
                            Batch Number:
                        </b>{" "}

                        {
                            duplicateInfo
                                ?.batch_number ||
                            "—"
                        }

                    </Typography>


                    <Typography>

                        <b>
                            Created Date:
                        </b>{" "}

                        {
                            duplicateInfo
                                ?.created_at
                                ? new Date(
                                    duplicateInfo.created_at
                                ).toLocaleDateString()
                                : "—"
                        }

                    </Typography>

                </Stack>

            </ConfirmDialog>

        </Box>

    );
}


export default ComplaintForm;