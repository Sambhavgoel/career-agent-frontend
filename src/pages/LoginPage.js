import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Avatar,
    Grid,
    Link,
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // Icon for Guest Button

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isGuestLoading, setIsGuestLoading] = useState(false);

    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        console.log('Form submitted, Attempting to login...');
        try {
            const res = await axios.post('https://career-agent.onrender.com/api/auth/login', formData);
            console.log('Registration successful : ', res.data);
            console.log('Api call successful. Token recieved: ', res.data.token);
            console.log('Attempting to set token');
            setToken(res.data.token);
            console.log('Token set, navigating to dashboard');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error : ', err.response?.data);
            setError(err.response?.data?.msg || 'Login failed, Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setIsGuestLoading(true);
        setError('');
        try {
            const res = await axios.post('https://career-agent.onrender.com/api/auth/guest');
            setToken(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Guest Login Error : ', err.response?.data);
            setError('Guest login failed. Please try again.');
        } finally {
            setIsGuestLoading(false);
        }
    };


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 64px)',
                backgroundColor: (theme) => theme.palette.grey[50],
                p: 3,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '450px',
                    width: '100%',
                    borderRadius: 2,
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Typography component="p" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Welcome back to your AI Career Coach.
                </Typography>
                <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        variant="outlined"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        variant="outlined"
                        autoComplete="current-password"
                        value={password}
                        onChange={onChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 1, py: 1.5, fontSize: '1rem' }} // Adjusted margin bottom
                        disabled={isLoading || isGuestLoading} // Disable if guest login is loading
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>

                    
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined" // Different style for guest button
                        startIcon={isGuestLoading ? <CircularProgress size={20} /> : <PersonOutlineIcon />}
                        sx={{ mt: 1, mb: 2, py: 1.5, fontSize: '1rem' }}
                        disabled={isLoading || isGuestLoading} // Disable if regular login is loading
                        onClick={handleGuestLogin}
                    >

                        Continue as Guest
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;