import { useState } from "react";

import { Grid, Paper, Box } from "@mui/material";

import Layout from "../components/layout/Layout";
import ComplaintForm from "../components/form/ComplaintForm";
import AIResult from "../components/ai/AIResult";
import ComplaintHistory from "../components/history/ComplaintHistory";
import DashboardStats from "../components/stats/DashboardStats";

function Dashboard() {

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <Layout>

            {/* Dashboard Statistics */}
            <DashboardStats
                refreshTrigger={refreshTrigger}
            />

            {/* Main Workspace */}
            <Grid
                container
                spacing={2}
                alignItems="flex-start"
                sx={{
                    mb: 3,
                }}
            >

                {/* Complaint Form */}
                <Grid
                    size={{
                        xs: 12,
                        lg: 7,
                    }}
                >

                    <Paper
                        elevation={2}
                        sx={{
                            p: {
                                xs: 2,
                                md: 2.5,
                            },
                            borderRadius: 2,
                            height: "auto",
                        }}
                    >

                        <ComplaintForm
                            setRefreshTrigger={setRefreshTrigger}
                        />

                    </Paper>

                </Grid>


                {/* AI Analysis */}
                <Grid
                    size={{
                        xs: 12,
                        lg: 5,
                    }}
                >

                    <Paper
                        elevation={2}
                        sx={{
                            p: {
                                xs: 2,
                                md: 2.5,
                            },
                            borderRadius: 2,
                            height: "auto",
                        }}
                    >

                        <AIResult />

                    </Paper>

                </Grid>

            </Grid>


            {/* Complaint History */}
            <Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: {
                            xs: 2,
                            md: 2.5,
                        },
                        borderRadius: 2,
                    }}
                >

                    <ComplaintHistory
                        refreshTrigger={refreshTrigger}
                    />

                </Paper>

            </Box>

        </Layout>
    );
}

export default Dashboard;