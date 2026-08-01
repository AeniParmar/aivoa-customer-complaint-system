import { useState } from "react";

import { Grid, Paper } from "@mui/material";

import Layout from "../components/layout/Layout";
import ComplaintForm from "../components/form/ComplaintForm";
import AIResult from "../components/ai/AIResult";
import ComplaintHistory from "../components/history/ComplaintHistory";
import DashboardStats from "../components/stats/DashboardStats";

function Dashboard() {

    const [aiResult, setAIResult] = useState(null);

    console.log("Dashboard aiResult:", aiResult);

    return (
        <Layout>

            <DashboardStats />
            
            {/* Top Section */}
            <Grid container spacing={3}>

                {/* Complaint Form */}
                <Grid size={{ xs: 12, md: 7 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            minHeight: "700px",
                        }}
                    >
                        <ComplaintForm
                            setAIResult={setAIResult}
                        />
                    </Paper>

                </Grid>

                {/* AI Analysis */}
                <Grid size={{ xs: 12, md: 5 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            minHeight: "700px",
                        }}
                    >
                        <AIResult
                            result={aiResult}
                        />
                    </Paper>

                </Grid>

            </Grid>

            {/* Bottom Section */}

            <Paper
                elevation={3}
                sx={{
                    mt: 4,
                    p: 3,
                }}
            >

                <ComplaintHistory />

            </Paper>

        </Layout>
    );
}

export default Dashboard;