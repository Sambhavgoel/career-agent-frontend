import React, { useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Skeleton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const AnalyzerPage = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);

  const handleAnalyzer = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      setError("Please paste both your resume and the job description.");
      return;
    }
    setIsLoading(true);
    setError("");
    setAnalysisResult(null);

    try {
      const config = { headers: { "x-auth-token": token } };
      // Using relative path for deployment
      const res = await axios.post(
        "/api/agent/analyzer",
        { resumeText, jobDescriptionText },
        config
      );
      setAnalysisResult(res.data);
    } catch (err) {
      console.error("Error fetching analysis : ", err);
      setError(
        err.response?.data?.msg ||
          "An error occurred during analysis. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

 return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}> {/* ✅ FIX: This removes the width limit, allowing the boxes to expand. */}
        <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Resume Analyzer
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ maxWidth: "700px" }}
            >
                Paste your resume and a job description to get an AI-powered analysis
                and actionable improvement suggestions.
            </Typography>
        </Stack>

        <Grid container spacing={4} justifyContent="center">
            {/* Resume Input Card */}
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <DescriptionIcon color="primary" sx={{ mr: 1.5 }} />
                        <Typography variant="h6" component="h2">
                            Your Resume
                        </Typography>
                    </Box>
                    <TextField
                        multiline
                        rows={15}
                        fullWidth
                        variant="outlined"
                        placeholder="Paste your full resume text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-root": {
                                height: "100%",
                                alignItems: "flex-start",
                            },
                        }}
                    />
                </Paper>
            </Grid>

            {/* Job Description Input Card */}
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <WorkOutlineIcon color="primary" sx={{ mr: 1.5 }} />
                        <Typography variant="h6" component="h2">
                            Job Description
                        </Typography>
                    </Box>
                    <TextField
                        multiline
                        rows={15}
                        fullWidth
                        variant="outlined"
                        placeholder="Paste the full job description here..."
                        value={jobDescriptionText}
                        onChange={(e) => setJobDescriptionText(e.target.value)}
                        sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-root": {
                                height: "100%",
                                alignItems: "flex-start",
                            },
                        }}
                    />
                </Paper>
            </Grid>
        </Grid>

        <Box textAlign="center" sx={{ my: 4 }}>
            <Button
                variant="contained"
                size="large"
                onClick={handleAnalyzer}
                disabled={isLoading}
                startIcon={
                    isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        <AutoFixHighIcon />
                    )
                }
                sx={{
                    minWidth: 200,
                    minHeight: 52,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    borderRadius: "8px",
                }}
            >
                {isLoading ? "Analyzing..." : "Generate Report"}
            </Button>
        </Box>

        {/* --- The rest of your component (error, skeleton, and results) remains the same --- */}
        {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        )}

        {isLoading && (
                <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Skeleton variant="circular" width={120} height={120} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
                            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
                            <Skeleton variant="rectangular" height={80} />
                        </Grid>
                    </Grid>
                </Paper>
            )}

        {analysisResult && (
                <Paper
                    elevation={3}
                    sx={{ p: { xs: 2, sm: 4 }, mt: 4, borderRadius: 2 }}
                >
                    <Typography variant="h5" component="h2" gutterBottom>
                        Analysis Report
                    </Typography>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={analysisResult.matchScore}
                                    size={120}
                                    thickness={4}
                                    sx={{
                                        color: (theme) => (analysisResult.matchScore > 75 ? theme.palette.success.main : analysisResult.matchScore > 50 ? theme.palette.warning.main : theme.palette.error.main),
                                    }}
                                />
                                <Box
                                    sx={{
                                        top: 0, left: 0, bottom: 0, right: 0,
                                        position: 'absolute', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="h4" component="div" color="text.primary">
                                        {`${Math.round(analysisResult.matchScore)}%`}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="h6" sx={{ mt: 1 }}>Match Score</Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Strengths
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">{analysisResult.strengths}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LightbulbOutlinedIcon color="primary" sx={{ mr: 1 }} /> Suggested Improvements
                                    </Typography>
                                    <List dense>
                                        {analysisResult.improvements.map((item, index) => (
                                            <ListItem key={index} disableGutters>
                                                <ListItemText primary={`• ${item}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            )}
    </Container>
);
};

export default AnalyzerPage;