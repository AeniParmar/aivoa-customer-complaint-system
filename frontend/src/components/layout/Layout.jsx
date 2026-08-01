import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <>
            <Navbar />

            <Container
                maxWidth="xl"
                sx={{
                    mt: 4,
                    mb: 4,
                }}
            >
                <Box>
                    {children}
                </Box>
            </Container>
        </>
    );
}

export default Layout;