import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";

function Layout({ children }) {

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
            }}
        >

            <Navbar />

            <Container
                maxWidth="xl"
                sx={{
                    width: "100%",
                    maxWidth: "1400px !important",
                    px: {
                        xs: 1.5,
                        sm: 2,
                        md: 2.5,
                    },
                    pt: {
                        xs: 2,
                        md: 2.5,
                    },
                    pb: 4,
                }}
            >

                {children}

            </Container>

        </Box>
    );
}

export default Layout;