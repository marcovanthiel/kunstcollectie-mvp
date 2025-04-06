import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ArtworkList from './pages/artwork/ArtworkList';
import ArtworkDetail from './pages/artwork/ArtworkDetail';
import ArtistList from './pages/artist/ArtistList';
import ArtistDetail from './pages/artist/ArtistDetail';
import LocationList from './pages/location/LocationList';
import LocationDetail from './pages/location/LocationDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Thema met de vereiste kleuren: blauw, paars, groen
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // blauw
    },
    secondary: {
      main: '#9c27b0', // paars
    },
    success: {
      main: '#2e7d32', // groen
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Health check route */}
          <Route path="/health" element={<div>OK</div>} />
          
          {/* Login route als hoofdpagina */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Beveiligde routes binnen Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="kunstwerken" element={<ArtworkList />} />
            <Route path="kunstwerken/:id" element={<ArtworkDetail />} />
            <Route path="kunstenaars" element={<ArtistList />} />
            <Route path="kunstenaars/:id" element={<ArtistDetail />} />
            <Route path="locaties" element={<LocationList />} />
            <Route path="locaties/:id" element={<LocationDetail />} />
            <Route path="rapportages" element={<Reports />} />
            <Route path="instellingen" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
