import {
    Box,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { useSelector } from "react-redux";

function AIResult() {

    const result = useSelector(
        (state) => state.complaint.aiResult
    );

    if (!result) {
        return (
            <Paper
                elevation={0}
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography color="text.secondary">
                    AI Analysis will appear here...
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>

            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
            >
                AI Analysis
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>

                <Typography>
                    <b>Customer :</b> {result.customer_name}
                </Typography>

                <Typography>
                    <b>Product :</b> {result.product_name}
                </Typography>

                <Typography>
                    <b>Batch :</b> {result.batch_number}
                </Typography>

                <Typography>
                    <b>Quantity :</b> {result.quantity}
                </Typography>

                <Box>

                    <Typography mb={1}>
                        <b>Category</b>
                    </Typography>

                    <Chip
                        label={result.category}
                        color="primary"
                    />

                </Box>

                <Box>

                    <Typography mb={1}>
                        <b>Severity</b>
                    </Typography>

                    <Chip
                        label={result.severity}
                        color="warning"
                    />

                </Box>

                <Box>

                    <Typography fontWeight="bold">
                        Risk Assessment
                    </Typography>

                    <Typography>
                        {result.risk_assessment}
                    </Typography>

                </Box>

                <Box>

                    <Typography fontWeight="bold">
                        Suggested Action
                    </Typography>

                    <Typography>
                        {result.next_action}
                    </Typography>

                </Box>

                <Box>

                    <Typography fontWeight="bold">
                        Complaint Summary
                    </Typography>

                    <Typography>
                        {result.complaint_summary || "—"}
                    </Typography>

                </Box>

                <Box>

                    <Typography fontWeight="bold">
                        Root Cause
                    </Typography>

                    <Typography>
                        {result.root_cause || "—"}
                    </Typography>

                </Box>

                <Box>

                    <Typography fontWeight="bold">
                        CAPA Recommendation
                    </Typography>

                    <Typography>
                        {result.capa_recommendation || "—"}
                    </Typography>

                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Complaint Completeness
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <b>Score:</b> {result.completeness_score}%
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <b>Status:</b> {result.completeness_status}
                    </Typography>

                    <Typography sx={{ mt: 2, mb: 1 }}>
                        <b>Missing Fields</b>
                    </Typography>

                    {result.missing_fields?.length > 0 ? (

                        <ul style={{ marginTop: 0, paddingLeft: "20px" }}>

                            {result.missing_fields.map((field, index) => (

                                <li key={index}>
                                    {field}
                                </li>

                            ))}

                        </ul>

                    ) : (

                        <Typography color="success.main">
                            ✅ All required fields are available.
                        </Typography>

                    )}

                </Box>

            </Stack>

        </Box>
    );
}

export default AIResult;