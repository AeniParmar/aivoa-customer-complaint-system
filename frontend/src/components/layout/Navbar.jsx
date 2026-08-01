import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

function Navbar() {
    return (
        <AppBar
            position="static"
            elevation={2}
            sx={{
                backgroundColor: "#1565C0",
            }}
        >
            <Toolbar>

                <LocalHospitalIcon
                    sx={{
                        mr: 2,
                        fontSize: 34
                    }}
                />

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        AIVOA Customer Complaint System
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        AI Powered Pharmaceutical Complaint Management
                    </Typography>

                </Box>

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;