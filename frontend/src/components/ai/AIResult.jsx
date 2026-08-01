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

            </Stack>

        </Box>
    );
}

export default AIResult;