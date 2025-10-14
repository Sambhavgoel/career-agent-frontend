import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Box
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const DashboardPage = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const features = [
        {
            title: 'AI Career Coach',
            description: 'Start a conversation with your personal AI assistant for career advice.',
            link: '/chat',
            icon: <ChatIcon sx={{ fontSize: 50 }} color="primary" />
        },
        {
            title: 'Resume Analyzer',
            description: 'Analyze your resume against a specific job description for tailored feedback.',
            link: '/analyzer',
            icon: <AnalyticsIcon sx={{ fontSize: 50 }} color="primary" />
        }
    ];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Welcome to your Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 5 }}>
                This is your protected area. Select a tool below to get started.
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {features.map((feature) => (
                    <Grid item key={feature.title} xs={12} sm={6} md={5}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
                            <CardActionArea component={Link} to={feature.link} sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                <Box sx={{ mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DashboardPage;