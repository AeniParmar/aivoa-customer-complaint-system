import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import { getComplaints } from "../../services/complaintService";

function DashboardStats() {

    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        resolved: 0,
        high: 0,
    });

    useEffect(() => {

        loadStats();

    }, []);

    const loadStats = async () => {

        try {

            const complaints = await getComplaints();

            setStats({
                total: complaints.length,
                open: complaints.filter(c => c.status === "open").length,
                resolved: complaints.filter(c => c.status === "resolved").length,
                high: complaints.filter(c =>
                    c.severity?.toLowerCase() === "high"
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
        },
        {
            title: "Open",
            value: stats.open,
        },
        {
            title: "High Severity",
            value: stats.high,
        },
        {
            title: "Resolved",
            value: stats.resolved,
        },
    ];

    return (

        <Grid container spacing={3} mb={4}>

            {cards.map((card) => (

                <Grid
                    key={card.title}
                    size={{ xs: 12, sm: 6, md: 3 }}
                >

                    <Card elevation={4}>

                        <CardContent>

                            <Typography
                                color="text.secondary"
                            >
                                {card.title}
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                {card.value}
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

}

export default DashboardStats;