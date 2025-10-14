import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Career Agent AI
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
                Your personal AI-powered assistant to help you land your dream job. Analyze your resume, practice for interviews, and get expert career advice.
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button component={Link} to="/register" variant="contained" size="large" sx={{ mr: 2 }}>
                    Get Started
                </Button>
                <Button component={Link} to="/login" variant="outlined" size="large">
                    Sign In
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;