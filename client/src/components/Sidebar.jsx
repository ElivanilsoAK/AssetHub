import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar // Importar Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <Paper
      sx={{
        height: '100vh',
        width: '250px',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'primary.main',
        color: 'white',
        zIndex: 1200 // Garante que a sidebar fique acima do conteúdo
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          AssetHUB
        </Typography>
        {user && (
          <Box sx={{ mb: 2 }}>
            <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'primary.light' }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user.role}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Button
            startIcon={<DashboardIcon />}
            sx={{ justifyContent: 'flex-start', color: 'white' }}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            startIcon={<InventoryIcon />}
            sx={{ justifyContent: 'flex-start', color: 'white' }}
            onClick={() => navigate('/inventory')}
          >
            Inventário
          </Button>
          <Button
            startIcon={<ReportsIcon />}
            sx={{ justifyContent: 'flex-start', color: 'white' }}
            onClick={() => navigate('/reports')}
          >
            Relatórios
          </Button>
          <Button
            startIcon={<SettingsIcon />}
            sx={{ justifyContent: 'flex-start', color: 'white' }}
            onClick={() => navigate('/settings')}
          >
            Configurações
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ color: 'white' }}
        >
          Sair
        </Button>
      </Box>
    </Paper>
  );
};

export default Sidebar;