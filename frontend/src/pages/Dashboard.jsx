import { useState } from "react";

import { Grid, Paper } from "@mui/material";

import Layout from "../components/layout/Layout";
import ComplaintForm from "../components/form/ComplaintForm";
import AIResult from "../components/ai/AIResult";
import ComplaintHistory from "../components/history/ComplaintHistory";
import DashboardStats from "../components/stats/DashboardStats";

function Dashboard() {

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (

        <Layout>

            <DashboardStats refreshTrigger={refreshTrigger} />

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 7 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            minHeight: "700px",
                        }}
                    >

                        <ComplaintForm
                            setRefreshTrigger={setRefreshTrigger}
                        />

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            minHeight: "700px",
                        }}
                    >

                        <AIResult />

                    </Paper>

                </Grid>

            </Grid>

            <Paper
                elevation={3}
                sx={{
                    mt: 4,
                    p: 3,
                }}
            >

                <ComplaintHistory
                    refreshTrigger={refreshTrigger}
                />

            </Paper>

        </Layout>

    );

}

export default Dashboard;