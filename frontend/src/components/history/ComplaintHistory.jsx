import { useEffect, useState } from "react";

import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import {
    deleteComplaint,
    getComplaints,
} from "../../services/complaintService";

function ComplaintHistory({ refreshTrigger }) {

    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadComplaints = async () => {

        try {

            const data = await getComplaints();

            setComplaints(data);
            setFilteredComplaints(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadComplaints();

    }, [refreshTrigger]);

    useEffect(() => {

        const filtered = complaints.filter((complaint) =>

            complaint.customer_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            complaint.product_name
                .toLowerCase()
                .includes(search.toLowerCase())

        );

        setFilteredComplaints(filtered);

    }, [search, complaints]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this complaint?")) return;

        try {

            await deleteComplaint(id);

            loadComplaints();

        } catch (error) {

            console.error(error);

        }

    };

    const severityColor = (severity) => {

        switch (severity?.toLowerCase()) {

            case "critical":
                return "error";

            case "high":
                return "warning";

            case "medium":
                return "info";

            default:
                return "success";

        }

    };

    if (loading) {

        return (

            <Box textAlign="center" py={5}>

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box>

            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
            >
                Complaint History
            </Typography>

            <TextField
                fullWidth
                label="Search by Customer or Product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell><b>Customer</b></TableCell>

                            <TableCell><b>Product</b></TableCell>

                            <TableCell><b>Severity</b></TableCell>

                            <TableCell><b>Status</b></TableCell>

                            <TableCell><b>Date</b></TableCell>

                            <TableCell align="center">
                                <b>Action</b>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredComplaints.map((complaint) => (

                            <TableRow key={complaint.id} hover>

                                <TableCell>

                                    {complaint.customer_name}

                                </TableCell>

                                <TableCell>

                                    {complaint.product_name}

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={complaint.severity}
                                        color={severityColor(complaint.severity)}
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={complaint.status}
                                        color={
                                            complaint.status === "open"
                                                ? "warning"
                                                : "success"
                                        }
                                    />

                                </TableCell>

                                <TableCell>

                                    {new Date(
                                        complaint.created_at
                                    ).toLocaleDateString()}

                                </TableCell>

                                <TableCell align="center">

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            handleDelete(complaint.id)
                                        }
                                    >

                                        <DeleteIcon />

                                    </IconButton>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>

    );

}

export default ComplaintHistory;