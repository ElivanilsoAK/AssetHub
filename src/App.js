import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes de autenticação
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

// Componentes de layout
import Layout from './components/layout/Layout';

// Páginas principais
import Dashboard from './pages/Dashboard';
import PrintersPage from './pages/PrintersPage';
import TonersPage from './pages/TonersPage';
import NotebooksPage from './pages/NotebooksPage';
import SmartphonesPage from './pages/SmartphonesPage';
import BagsPage from './pages/BagsPage';
import ToolsPage from './pages/ToolsPage';
import ServiceOrdersPage from './pages/ServiceOrdersPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import DepartmentsPage from './pages/DepartmentsPage';

// Contexto de autenticação
import { AuthProvider } from '../contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', // Roxo
    },
    secondary: {
      main: '#ec407a', // Rosa
    },
    background: {
      default: '#f5f5f5',
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="printers" element={<PrintersPage />} />
              <Route path="toners" element={<TonersPage />} />
              <Route path="notebooks" element={<NotebooksPage />} />
              <Route path="smartphones" element={<SmartphonesPage />} />
              <Route path="bags" element={<BagsPage />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="service-orders" element={<ServiceOrdersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;