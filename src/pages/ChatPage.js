// frontend/src/pages/ChatPage.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    TextField,
    IconButton,
    List,
    ListItem,
    Avatar,
    CircularProgress,
    Typography,
    styled,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";


const MessagePaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isUser'
})(({ theme, isUser }) => ({
    padding: theme.spacing(1.2, 2),
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    borderRadius: isUser ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
    boxShadow: theme.shadows[1],
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',

    // This specifically targets the code blocks that cause the overflow.
    '& pre': {
        whiteSpace: 'pre-wrap', // Allows code blocks to wrap.
        wordBreak: 'break-all',   // Breaks long unbreakable strings in code.
        overflowX: 'auto',      // Adds a scrollbar only to the code block if needed.
    },
    '& code': {
        wordBreak: 'break-word', // Ensures inline code also wraps.
    }
}));

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const isGuest = useAuthStore((state)=> state.isGuest)
    const chatWindowRef = useRef(null);

    useEffect(() => {
        const loadHistory = async () => {
            if (!conversationId || isGuest) {
                setMessages([]);
                setIsHistoryLoading(false)
                return;
            }
            setIsHistoryLoading(true);
            try {
                const config = { headers: { "x-auth-token": token } };
                const res = await axios.get(
                    `https://career-agent.onrender.com/api/conversations/${conversationId}`,
                    config
                );
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to load chat history:", error);
                navigate("/chat");
            } finally {
                setIsHistoryLoading(false);
            }
        };
        if (token){ loadHistory()}
        else{
            setIsHistoryLoading(false)
            setMessages([])
        };
    }, [conversationId, token, navigate,isGuest]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", parts: [{ text: input }] };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput("");
        setIsLoading(true);

        const history = messages.map((msg) => ({
            role: msg.role,
            parts: msg.parts,
        }));

        try {
            const config = { headers: { "x-auth-token": token } };
            const res = await axios.post(
                "https://career-agent.onrender.com/api/conversations",
                { message: input, conversationId, history },
                config
            );
            const aiMessage = { role: "model", parts: [{ text: res.data.reply }] };

            if (!conversationId) {
                setMessages((prev) => [...prev, aiMessage]);
                navigate(`/chat/${res.data.conversationId}`);
            } else {
                setMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = {
                role: "model",
                parts: [{ text: "Sorry, I encountered an error. Please try again." }],
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    // --- END OF UNCHANGED LOGIC ---

    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: 'grey.100'
        }}>
            <Box
                ref={chatWindowRef}
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: { xs: 1, sm: 2 }
                }}
            >
                {isHistoryLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 && !conversationId ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <QuestionAnswerIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary">Start a New Conversation</Typography>
                    </Box>
                ) : (
                    <List>
                        {messages.map((msg, index) => {
                            const isUser = msg.role === "user";
                            return (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: isUser ? "flex-end" : "flex-start",
                                        pl: isUser ? 6 : 1,
                                        pr: isUser ? 1 : 6,
                                        mb: 1.5
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flexDirection: isUser ? "row-reverse" : "row" }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: isUser ? "primary.main" : "grey.700" }}>
                                            {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                                        </Avatar>
                                        <MessagePaper isUser={isUser}>
                                            <ReactMarkdown
                                                children={msg.parts[0].text}
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
                                                        ) : (
                                                            <code className={className} {...props}>{children}</code>
                                                        );
                                                    },
                                                }}
                                            />
                                        </MessagePaper>
                                    </Box>
                                </ListItem>
                            );
                        })}
                        {isLoading && (
                            <ListItem sx={{ justifyContent: "flex-start", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: "grey.700" }}><SmartToyIcon fontSize="small" /></Avatar>
                                    <Paper variant="outlined" sx={{ p: 1, borderRadius: '20px 20px 20px 5px', width: 60, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </Paper>
                                </Box>
                            </ListItem>
                        )}
                    </List>
                )}
            </Box>

            <Paper component="form" onSubmit={handleSubmit} elevation={4} square sx={{ p: '10px 16px', display: "flex", alignItems: "center" }}>
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                    multiline
                    maxRows={5}
                    InputProps={{ disableUnderline: true }}
                />
                <IconButton type="submit" color="primary" disabled={isLoading || !input.trim()} sx={{ ml: 1 }}>
                    {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
            </Paper>
        </Box>
    );
};

export default ChatPage;