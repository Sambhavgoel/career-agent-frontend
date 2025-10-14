// frontend/src/components/ConversationSidebar.js
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Button, Box, Typography, CircularProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const ConversationSidebar = () => {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { conversationId } = useParams();
    const token = useAuthStore((state) => state.token);

    // --- YOUR LOGIC IS UNCHANGED ---
    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/conversations', config);
                setConversations(res.data);
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (token) {
            fetchConversations();
        }
    }, [token, conversationId]);
    // --- END LOGIC ---

    return (
        // This Box creates the single bordered container for the sidebar
        <Box sx={{
            height: '100%',
            border: '2px solid black',
            borderRadius: '20px',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Button component={Link} to="/chat" variant="contained" fullWidth>
                + New Chat
            </Button>
            <Typography variant="overline" sx={{ mt: 2, display: 'block' }}>Recent</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {conversations.map((convo) => (
                            <ListItem key={convo._id} disablePadding>
                                <ListItemButton component={Link} to={`/chat/${convo._id}`} selected={conversationId === convo._id}>
                                    <ListItemText primary={convo.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default ConversationSidebar;