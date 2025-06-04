import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar
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

// Reutilizando o componente Sidebar do Dashboard
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
        <Box sx={{ width: '100%', my: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} />
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

// Componente de Card para categorias de inventário
const CategoryCard = ({ title, description, icon, color, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="glass-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            bgcolor: color
          }}
        />
        <CardContent sx={{ flexGrow: 1, pt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2 }}>
              {icon}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            variant="text"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            Gerenciar
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

const Inventory = () => {
  const [activeItem, setActiveItem] = useState('Inventário');
  const navigate = useNavigate();

  // Categorias de inventário
  const categories = [
    {
      title: 'Notebooks e Desktops',
      description: 'Gerenciamento de computadores, notebooks e periféricos associados.',
      icon: <LaptopIcon />,
      color: '#6a1b9a',
      path: '/inventory/computers'
    },
    {
      title: 'Celulares e Tablets',
      description: 'Controle de dispositivos móveis, linhas telefônicas e acessórios.',
      icon: <PhoneIcon />,
      color: '#2196f3',
      path: '/inventory/mobile-devices'
    },
    {
      title: 'Mochilas e Bolsas',
      description: 'Gerenciamento de mochilas, cases e bolsas para equipamentos.',
      icon: <BagIcon />,
      color: '#ff9800',
      path: '/inventory/bags'
    },
    {
      title: 'Impressoras',
      description: 'Controle de impressoras e seus contadores mensais.',
      icon: <PrinterIcon />,
      color: '#4caf50',
      path: '/inventory/printers'
    },
    {
      title: 'Toners e Suprimentos',
      description: 'Gerenciamento de estoque de toners e suprimentos para impressoras.',
      icon: <TonerIcon />,
      color: '#f44336',
      path: '/inventory/toners'
    }
  ];

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
              Inventário
            </Typography>

            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CategoryCard
                      title={category.title}
                      description={category.description}
                      icon={category.icon}
                      color={category.color}
                      onClick={() => navigate(category.path)}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Inventory;