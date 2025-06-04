import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes de Layout
import Layout from './components/Layout'; // Importar o componente de Layout

// Páginas (não precisa mais importar os componentes individualmente aqui, pois serão rotas filhas)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Computers from './pages/equipment/Computers';
import MobileDevices from './pages/equipment/MobileDevices';
import Bags from './pages/equipment/Bags';
import Printers from './pages/equipment/Printers';
import Toners from './pages/equipment/Toners';


// Tema personalizado (mantém-se o mesmo)
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Roxo escuro
      light: '#9c4dcc',
      dark: '#38006b',
    },
    secondary: {
      main: '#e1bee7', // Roxo claro
      light: '#fff1ff',
      dark: '#af8eb5',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Todas as rotas que usam a sidebar serão filhas de / */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />

            {/* Rotas de equipamentos */}
            <Route path="/equipment/computers" element={<Computers />} />
            <Route path="/equipment/mobile-devices" element={<MobileDevices />} />
            <Route path="/equipment/bags" element={<Bags />} />
            <Route path="/equipment/printers" element={<Printers />} />
            <Route path="/equipment/toners" element={<Toners />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;