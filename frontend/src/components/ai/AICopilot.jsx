import { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { updateComplaint } from "../../services/aiService";

function AICopilot({ complaintData, onUpdate }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const instruction = message.trim();

        if (!instruction || loading) {
            return;
        }

        const userMessage = {
            role: "user",
            content: instruction,
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const result = await updateComplaint(
                complaintData,
                instruction
            );

            if (result.error) {
                throw new Error(result.error);
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I've updated the complaint information based on your instruction.",
                },
            ]);

            if (onUpdate) {
                onUpdate(result);
            }
        } catch (error) {
            console.error("AI Copilot error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        error.response?.data?.detail ||
                        error.message ||
                        "Sorry, I couldn't update the complaint.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    🤖 AIVOA Copilot
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Update the complaint using natural language.
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    minHeight: 250,
                }}
            >
                {messages.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mt: 5 }}
                    >
                        Try something like:
                        <br />
                        <br />
                        <b>
                            "Change the batch number to
                            AMX240602."
                        </b>
                    </Typography>
                ) : (
                    <Stack spacing={1.5}>
                        {messages.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf:
                                        item.role === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                    maxWidth: "85%",
                                    p: 1.5,
                                    borderRadius: 2,
                                    backgroundColor:
                                        item.role === "user"
                                            ? "primary.main"
                                            : "action.hover",
                                    color:
                                        item.role === "user"
                                            ? "primary.contrastText"
                                            : "text.primary",
                                }}
                            >
                                <Typography variant="body2">
                                    {item.content}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}

                {loading && (
                    <Box sx={{ mt: 2 }}>
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    p: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        maxRows={3}
                        placeholder="Type an instruction..."
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />

                    <Button
                        variant="contained"
                        onClick={handleSend}
                        disabled={!message.trim() || loading}
                        sx={{
                            minWidth: 48,
                            alignSelf: "stretch",
                        }}
                    >
                        {loading ? (
                            <CircularProgress
                                size={20}
                                color="inherit"
                            />
                        ) : (
                            <SendIcon />
                        )}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default AICopilot;