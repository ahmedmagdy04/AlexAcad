import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiChat from './components/AiChat';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Departments from './pages/Departments';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

// Pages where Footer should be hidden
const NO_FOOTER_PATHS = ['/login', '/signup', '/chat'];

// Pages where floating AI chat widget should be hidden (chat page has its own)
const NO_AICHAT_PATHS = ['/chat'];

function AppInner() {
  const location = useLocation();
  const hideFooter = NO_FOOTER_PATHS.includes(location.pathname);
  const hideAiChat = NO_AICHAT_PATHS.includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideFooter && <Footer />}
      {!hideAiChat && <AiChat />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
