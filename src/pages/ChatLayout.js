// frontend/src/pages/ChatLayout.js
import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import ConversationSidebar from '../pages/ConversationSidebar';

const ChatLayout = () => {
    return (
        // This Box creates the main flex container with a gap between the sidebar and chat area.
        <Box sx={{
            display: 'flex',
            height: 'calc(100vh - 64px)', // Full height minus Navbar
            p: '10px', // Padding around the entire container
            gap: '10px', // Space between the sidebar and the main content
        }}>
            {/* Sidebar Area */}
            <Box sx={{ width: { sm: '30%', md: '15%' } }}>
                <ConversationSidebar />
            </Box>

            {/* Main Content Area (where ChatPage will render) */}
            <Box sx={{ flexGrow: 1, width: { sm: '70%', md: '75%' } }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default ChatLayout;