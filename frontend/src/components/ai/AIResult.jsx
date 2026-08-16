import {
    Alert,
    Box,
    Chip,
    Divider,
    LinearProgress,
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
                variant="outlined"
                sx={{
                    minHeight: 420,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                    background:
                        "linear-gradient(145deg,#f8fbff,#ffffff)",
                }}
            >

                <Box
                    textAlign="center"
                    sx={{ px: 3 }}
                >

                    <Typography
                        sx={{
                            fontSize: 42,
                            mb: 1,
                        }}
                    >
                        ✨
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        AI Analysis
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Upload a complaint PDF or analyze
                        a complaint to generate
                        AI-powered insights.
                    </Typography>

                </Box>

            </Paper>

        );
    }


    const severity = result.severity || "Medium";


    const severityColor =
        severity === "Critical"
            ? "error"
            : severity === "High"
                ? "warning"
                : severity === "Medium"
                    ? "info"
                    : "success";


    return (

        <Paper
            elevation={0}
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                overflow: "hidden",
                backgroundColor: "#ffffff",
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    background:
                        "linear-gradient(135deg,#1976d2,#00897b)",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                <Box>

                    <Typography
                        fontWeight={700}
                    >
                        ✨ AI Analysis
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{ opacity: 0.9 }}
                    >
                        Intelligent complaint assessment
                    </Typography>

                </Box>


                <Chip
                    label={severity}
                    color={severityColor}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        color: "white",
                    }}
                />

            </Box>


            <Box sx={{ p: 2 }}>

                {/* OVERVIEW */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Complaint Overview
                </Typography>


                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(2,minmax(0,1fr))",
                        gap: 1,
                    }}
                >

                    <InfoCard
                        label="Customer"
                        value={result.customer_name}
                    />

                    <InfoCard
                        label="Product"
                        value={result.product_name}
                    />

                    <InfoCard
                        label="Batch Number"
                        value={result.batch_number}
                    />

                    <InfoCard
                        label="Quantity"
                        value={result.quantity}
                    />

                </Box>


                <Divider sx={{ my: 2 }} />


                {/* CLASSIFICATION */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                >
                    Classification
                </Typography>


                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >

                    <Chip
                        label={
                            result.category ||
                            "Unclassified"
                        }
                        variant="outlined"
                        size="small"
                    />

                    <Chip
                        label={`Severity: ${severity}`}
                        color={severityColor}
                        size="small"
                    />

                </Stack>


                {/* RISK */}

                <InsightCard
                    title="⚠ Risk Assessment"
                    text={
                        result.risk_assessment ||
                        "Risk assessment unavailable."
                    }
                    type="warning"
                />


                {/* ACTION */}

                <InsightCard
                    title="→ Recommended Action"
                    text={
                        result.next_action ||
                        "Review complaint and determine next steps."
                    }
                    type="info"
                />


                {/* SUMMARY */}

                <InsightCard
                    title="📄 Complaint Summary"
                    text={
                        result.complaint_summary ||
                        "No summary available."
                    }
                />


                {/* ROOT CAUSE */}

                <InsightCard
                    title="🔎 Root Cause"
                    text={
                        result.root_cause ||
                        "Root cause could not be determined."
                    }
                />


                {/* CAPA */}

                <InsightCard
                    title="🛠 CAPA Recommendation"
                    text={
                        result.capa_recommendation ||
                        "No CAPA recommendation available."
                    }
                />


                <Divider sx={{ my: 2 }} />


                {/* COMPLETENESS */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                >
                    Complaint Completeness
                </Typography>


                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                    }}
                >

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 0.8 }}
                    >

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            Data completeness
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={700}
                        >
                            {result.completeness_score ?? 0}%
                        </Typography>

                    </Stack>


                    <LinearProgress
                        variant="determinate"
                        value={
                            result.completeness_score || 0
                        }
                        sx={{
                            height: 7,
                            borderRadius: 5,
                        }}
                    />


                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 1,
                        }}
                    >
                        <b>Status:</b>{" "}
                        {result.completeness_status ||
                            "Unknown"}
                    </Typography>


                    {result.missing_fields?.length > 0 ? (

                        <Typography
                            variant="caption"
                            color="warning.main"
                            sx={{
                                display: "block",
                                mt: 0.5,
                            }}
                        >
                            Missing:{" "}
                            {result.missing_fields.join(
                                ", "
                            )}
                        </Typography>

                    ) : (

                        <Typography
                            variant="caption"
                            color="success.main"
                            sx={{
                                display: "block",
                                mt: 0.5,
                            }}
                        >
                            ✓ All required fields are
                            available.
                        </Typography>

                    )}

                </Box>

            </Box>

        </Paper>

    );
}


/* ---------------- INFO CARD ---------------- */

function InfoCard({
    label,
    value,
}) {

    return (

        <Box
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 1.2,
                backgroundColor: "#fafafa",
                minWidth: 0,
            }}
        >

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                    mt: 0.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {value || "—"}
            </Typography>

        </Box>

    );
}


/* ---------------- INSIGHT CARD ---------------- */

function InsightCard({
    title,
    text,
    type = "default",
}) {

    const background =
        type === "warning"
            ? "#fffaf0"
            : type === "info"
                ? "#f5f9ff"
                : "#fafafa";


    const border =
        type === "warning"
            ? "#f6c86e"
            : type === "info"
                ? "#b8d4ff"
                : "#e2e8f0";


    return (

        <Box
            sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${border}`,
                backgroundColor: background,
            }}
        >

            <Typography
                variant="body2"
                fontWeight={700}
                sx={{ mb: 0.6 }}
            >
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    lineHeight: 1.55,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {text}
            </Typography>

        </Box>

    );
}


export default AIResult;