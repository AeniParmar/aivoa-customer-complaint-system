import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
} from "@mui/material";

import { getComplaints } from "../../services/complaintService";

function DashboardStats({ refreshTrigger }) {

    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        high: 0,
    });

    useEffect(() => {
        loadStats();
    }, [refreshTrigger]);

    const loadStats = async () => {

        try {

            const complaints = await getComplaints();

            setStats({
                total: complaints.length,

                open: complaints.filter(
                    c => c.status === "open"
                ).length,

                high: complaints.filter(
                    c => c.severity?.toLowerCase() === "high"
                ).length,
            });

        } catch (error) {

            console.error(error);

        }
    };

    const cards = [
        {
            title: "Total Complaints",
            value: stats.total,
            description: "All complaints received",
        },
        {
            title: "Open Complaints",
            value: stats.open,
            description: "Requiring attention",
        },
        {
            title: "High Severity",
            value: stats.high,
            description: "High-risk complaints",
        },
    ];

    return (

        <Grid
            container
            spacing={2}
            sx={{
                mb: 2.5,
            }}
        >

            {cards.map((card) => (

                <Grid
                    key={card.title}
                    size={{
                        xs: 12,
                        sm: 4,
                    }}
                >

                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 2,
                            height: 105,
                        }}
                    >

                        <CardContent
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                px: 2.5,
                                py: 1.5,

                                "&:last-child": {
                                    pb: 1.5,
                                },
                            }}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight={600}
                            >
                                {card.title}
                            </Typography>


                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: 1,
                                    my: 0.3,
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: "1.8rem",
                                        lineHeight: 1,
                                        fontWeight: 700,
                                        color: "#111827",
                                    }}
                                >
                                    {card.value}
                                </Typography>

                            </Box>


                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {card.description}
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>
    );
}

export default DashboardStats;