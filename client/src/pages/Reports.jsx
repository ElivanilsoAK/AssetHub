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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  BarChart as ChartIcon
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

// Componente de Card para relatórios
const ReportCard = ({ title, description, icon, color, onClick }) => {
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
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        <CardContent sx={{ flexGrow: 1 }}>
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
            Gerar Relatório
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

const Reports = () => {
  const [activeItem, setActiveItem] = useState('Relatórios');
  const [reportType, setReportType] = useState('all');
  const navigate = useNavigate();

  // Tipos de relatórios
  const reportTypes = [
    {
      title: 'Inventário Completo',
      description: 'Relatório detalhado de todos os itens no inventário.',
      icon: <PdfIcon />,
      color: '#f44336',
      type: 'all'
    },
    {
      title: 'Equipamentos por Departamento',
      description: 'Distribuição de equipamentos por departamento.',
      icon: <ExcelIcon />,
      color: '#4caf50',
      type: 'department'
    },
    {
      title: 'Manutenções Programadas',
      description: 'Lista de equipamentos com manutenção programada.',
      icon: <PdfIcon />,
      color: '#ff9800',
      type: 'maintenance'
    },
    {
      title: 'Consumo de Toners',
      description: 'Análise de consumo de toners por impressora.',
      icon: <ChartIcon />,
      color: '#2196f3',
      type: 'toner'
    },
    {
      title: 'Garantias a Vencer',
      description: 'Equipamentos com garantia próxima do vencimento.',
      icon: <PdfIcon />,
      color: '#9c27b0',
      type: 'warranty'
    },
    {
      title: 'Histórico de Movimentações',
      description: 'Histórico de transferências de equipamentos entre usuários.',
      icon: <ExcelIcon />,
      color: '#607d8b',
      type: 'history'
    }
  ];

  // Filtrar relatórios pelo tipo selecionado
  const filteredReports = reportType === 'all' ? reportTypes : reportTypes.filter(report => report.type === reportType);

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
              Relatórios
            </Typography>

            <Paper className="glass-card" sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Filtrar Relatórios
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="report-type-label">Tipo de Relatório</InputLabel>
                <Select
                  labelId="report-type-label"
                  id="report-type"
                  value={reportType}
                  label="Tipo de Relatório"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="all">Todos os Relatórios</MenuItem>
                  <MenuItem value="department">Por Departamento</MenuItem>
                  <MenuItem value="maintenance">Manutenções</MenuItem>
                  <MenuItem value="toner">Consumo de Toners</MenuItem>
                  <MenuItem value="warranty">Garantias</MenuItem>
                  <MenuItem value="history">Histórico</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            <Grid container spacing={3}>
              {filteredReports.map((report, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ReportCard
                      title={report.title}
                      description={report.description}
                      icon={report.icon}
                      color={report.color}
                      onClick={() => console.log(`Gerando relatório: ${report.title}`)}
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

export default Reports;