import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import CalculatorPage from './pages/CalculatorPage';

function App() {
  const { initialize: initAuth } = useAuthStore();
  const { initialize: initTheme } = useThemeStore();

  useEffect(() => {
    initAuth();
    initTheme();
  }, [initAuth, initTheme]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Layout><PortfolioPage /></Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/calculator"
          element={
            <Layout><CalculatorPage /></Layout>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
