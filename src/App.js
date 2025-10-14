import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import AnalyzerPage from './pages/AnalyzerPage';
import ChatLayout from './pages/ChatLayout';

//auntentication check

function App() {
  return (
    // Assuming BrowserRouter is in index.js for best practice
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzer"
            element={
              <ProtectedRoute>
                <AnalyzerPage />
              </ProtectedRoute>
            }
          />
          <Route
        path="/chat"
        element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}
    >
        <Route index element={<ChatPage />} />
        <Route path=":conversationId" element={<ChatPage />} />
    </Route>
        </Routes>
      </main>
    </Box>
  );
}

export default App;