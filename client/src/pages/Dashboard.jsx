import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Laptop as LaptopIcon,
  PhoneAndroid as PhoneIcon,
  Print as PrinterIcon,
  Backpack as BagIcon,
  Inventory as InventoryIcon,
  ColorLens as TonerIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Assessment as ReportsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

// Componente de Sidebar
const Sidebar = ({ activeItem, setActiveItem }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Inventário', icon: <InventoryIcon />, path: '/inventory' },
    { name: 'Relatórios', icon: <ReportsIcon />, path: '/reports' },
    { name: 'Configurações', icon: <SettingsIcon />, path: '/settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100vh',
        width: '250px',
        borderRadius: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0
      }}
    >
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1
          }}
        >
          AssetHUB
        </Typography>
        <Divider sx={{ width: '100%', my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              mr: 2
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {user.name || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <Button
            key={item.name}
            startIcon={item.icon}
            onClick={() => {
              setActiveItem(item.name);
              navigate(item.path);
            }}
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              mb: 1,
              borderRadius: 2,
              width: '100%',
              color: activeItem === item.name ? 'primary.main' : 'text.secondary',
              bgcolor: activeItem === item.name ? 'rgba(106, 27, 154, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(106, 27, 154, 0.05)'
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: activeItem === item.name ? 'bold' : 'normal' }}>
              {item.name}
            </Typography>
          </Button>
        ))}
      </Box>

      <Box sx={{ p: 2 }}>
        <Button
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            borderRadius: 2,
            width: '100%',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(211, 47, 47, 0.05)',
              color: 'error.main'
            }
          }}
        >
          <Typography variant="body2">Sair</Typography>
        </Button>
      </Box>
    </Paper>
  );
};

// Componente de Card para estatísticas
const StatCard = ({ title, count, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="glass-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: `4px solid ${color}`,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Avatar sx={{ bgcolor: `${color}20`, color: color }}>{icon}</Avatar>
          </Box>
          <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
            {count}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Carregar estatísticas do dashboard
    const fetchStats = async () => {
      try {
        // Simulando dados de estatísticas (em produção, isso viria da API)
        // const response = await axios.get('http://localhost:5000/api/dashboard/stats');
        // setStats(response.data);
        
        // Dados simulados para demonstração
        setStats({
          computers: 42,
          mobileDevices: 28,
          bags: 15,
          printers: 8,
          toners: 23,
          maintenanceItems: 3
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '250px',
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', mt: 2 }}>
              Dashboard
            </Typography>

            <Grid container spacing={3}>
              {/* Cards de estatísticas */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Notebooks e Desktops"
                  count={stats.computers}
                  icon={<LaptopIcon />}
                  color="#6a1b9a"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Celulares e Tablets"
                  count={stats.mobileDevices}
                  icon={<PhoneIcon />}
                  color="#2196f3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Mochilas e Bolsas"
                  count={stats.bags}
                  icon={<BagIcon />}
                  color="#ff9800"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Impressoras"
                  count={stats.printers}
                  icon={<PrinterIcon />}
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Toners e Suprimentos"
                  count={stats.toners}
                  icon={<TonerIcon />}
                  color="#f44336"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Itens em Manutenção"
                  count={stats.maintenanceItems}
                  icon={<SettingsIcon />}
                  color="#9e9e9e"
                />
              </Grid>
            </Grid>

            {/* Seção de Atividades Recentes */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Atividades Recentes
              </Typography>
              <Paper className="glass-card" sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Nenhuma atividade recente para exibir.
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;