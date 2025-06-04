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
  Button,
  Avatar,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

// Reutilizando o componente Sidebar
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

const Settings = () => {
  const [activeItem, setActiveItem] = useState('Configurações');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Carregar dados do usuário do localStorage
  useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setDepartment(user.department || '');
    }
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Simulando atualização de perfil
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // Simulando atualização de senha
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

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
              Configurações
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Alterações salvas com sucesso!
              </Alert>
            )}

            <Grid container spacing={4}>
              {/* Perfil do Usuário */}
              <Grid item xs={12} md={6}>
                <Paper className="glass-card" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Perfil do Usuário
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box component="form" onSubmit={handleProfileUpdate}>
                    <TextField
                      fullWidth
                      label="Nome"
                      variant="outlined"
                      margin="normal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Departamento"
                      variant="outlined"
                      margin="normal"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3 }}
                    >
                      Salvar Alterações
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Segurança */}
              <Grid item xs={12} md={6}>
                <Paper className="glass-card" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
                      <SecurityIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Segurança
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box component="form" onSubmit={handlePasswordUpdate}>
                    <TextField
                      fullWidth
                      label="Senha Atual"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3 }}
                    >
                      Atualizar Senha
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Preferências */}
              <Grid item xs={12}>
                <Paper className="glass-card" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                      <PaletteIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Preferências
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Modo Escuro"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Alterna entre o tema claro e escuro da interface.
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Notificações por Email"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Receba alertas sobre manutenções, garantias e níveis de estoque por email.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Settings;