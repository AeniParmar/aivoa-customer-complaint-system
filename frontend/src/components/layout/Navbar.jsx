import {
    AppBar,
    Toolbar,
    Typography,
    Box,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

function Navbar() {

    return (

        <AppBar
            position="static"
            elevation={1}
            sx={{
                backgroundColor: "#1565C0",
            }}
        >

            <Toolbar
                sx={{
                    minHeight: {
                        xs: 58,
                        md: 64,
                    },
                    px: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >

                <LocalHospitalIcon
                    sx={{
                        mr: 1.5,
                        fontSize: {
                            xs: 30,
                            md: 32,
                        },
                    }}
                />


                <Box>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1.15rem",
                                md: "1.45rem",
                            },
                            fontWeight: 600,
                            lineHeight: 1.2,
                        }}
                    >
                        AIVOA Customer Complaint System
                    </Typography>


                    <Typography
                        sx={{
                            fontSize: {
                                xs: "0.7rem",
                                md: "0.78rem",
                            },
                            opacity: 0.9,
                            mt: 0.2,
                        }}
                    >
                        AI Powered Pharmaceutical Complaint Management
                    </Typography>

                </Box>

            </Toolbar>

        </AppBar>
    );
}

export default Navbar;