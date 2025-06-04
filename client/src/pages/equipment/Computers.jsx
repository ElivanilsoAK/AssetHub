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
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
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
          <IconButton
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 40,
              height: 40,
              mr: 2,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </IconButton>
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
              textAlign: 'left',
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mb: 1,
              width: '100%',
              color: activeItem === item.name ? 'primary.main' : 'text.secondary',
              bgcolor: activeItem === item.name ? 'rgba(106, 27, 154, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            px: 2,
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Sair
        </Button>
      </Box>
    </Paper>
  );
};

const Computers = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Inventário');
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentComputer, setCurrentComputer] = useState(null);
  const [formData, setFormData] = useState({
    type: 'notebook',
    brand: '',
    model: '',
    serialNumber: '',
    processor: '',
    memory: '',
    storage: '',
    operatingSystem: '',
    purchaseDate: '',
    warrantyExpiration: '',
    status: 'active',
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Buscar computadores
  const fetchComputers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/equipment/computers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComputers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar computadores:', error);
      setError('Erro ao carregar computadores. Tente novamente.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchComputers();
  }, [navigate]);

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Abrir diálogo para adicionar novo computador
  const handleAddComputer = () => {
    setCurrentComputer(null);
    setFormData({
      type: 'notebook',
      brand: '',
      model: '',
      serialNumber: '',
      processor: '',
      memory: '',
      storage: '',
      operatingSystem: '',
      purchaseDate: '',
      warrantyExpiration: '',
      status: 'active',
      notes: ''
    });
    setOpenDialog(true);
  };

  // Abrir diálogo para editar computador
  const handleEditComputer = (computer) => {
    setCurrentComputer(computer);
    setFormData({
      type: computer.type,
      brand: computer.brand,
      model: computer.model,
      serialNumber: computer.serialNumber,
      processor: computer.processor || '',
      memory: computer.memory || '',
      storage: computer.storage || '',
      operatingSystem: computer.operatingSystem || '',
      purchaseDate: computer.purchaseDate ? new Date(computer.purchaseDate).toISOString().split('T')[0] : '',
      warrantyExpiration: computer.warrantyExpiration ? new Date(computer.warrantyExpiration).toISOString().split('T')[0] : '',
      status: computer.status,
      notes: computer.notes || ''
    });
    setOpenDialog(true);
  };

  // Salvar computador (adicionar ou atualizar)
  const handleSaveComputer = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (currentComputer) {
        // Atualizar computador existente
        response = await axios.put(
          `http://localhost:5000/api/equipment/computers/${currentComputer.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({
          open: true,
          message: 'Computador atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        // Adicionar novo computador
        response = await axios.post(
          'http://localhost:5000/api/equipment/computers',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({
          open: true,
          message: 'Computador adicionado com sucesso!',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      fetchComputers();
    } catch (error) {
      console.error('Erro ao salvar computador:', error);
      setSnackbar({
        open: true,
        message: `Erro ao salvar computador: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  // Excluir computador
  const handleDeleteComputer = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este computador?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/equipment/computers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Computador excluído com sucesso!',
          severity: 'success'
        });
        fetchComputers();
      } catch (error) {
        console.error('Erro ao excluir computador:', error);
        setSnackbar({
          open: true,
          message: `Erro ao excluir computador: ${error.response?.data?.message || error.message}`,
          severity: 'error'
        });
      }
    }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Computadores
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddComputer}
                sx={{ borderRadius: 20, px: 3 }}
              >
                Adicionar
              </Button>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                mb: 4
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                  placeholder="Buscar computadores..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ width: 300 }}
                />
                <Box>
                  <Button
                    startIcon={<FilterIcon />}
                    onClick={() => setOpenFiltersDialog(true)}
                    sx={{ mr: 1, color: filters.type || filters.status || filters.brand ? 'primary.main' : 'text.secondary' }}
                  >
                    Filtrar
                  </Button>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ type: '', status: '', brand: '' });
                      fetchComputers();
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    Limpar
                  </Button>
                </Box>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Marca</TableCell>
                        <TableCell>Modelo</TableCell>
                        <TableCell>Nº de Série</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Usuário</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {computers.length > 0 ? (
                        computers.map((computer) => (
                          <TableRow key={computer.id}>
                            <TableCell>
                              <Chip
                                label={computer.type === 'notebook' ? 'Notebook' : 'Desktop'}
                                size="small"
                                color={computer.type === 'notebook' ? 'primary' : 'secondary'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{computer.brand}</TableCell>
                            <TableCell>{computer.model}</TableCell>
                            <TableCell>{computer.serialNumber}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  computer.status === 'active' ? 'Ativo' :
                                  computer.status === 'maintenance' ? 'Manutenção' :
                                  computer.status === 'retired' ? 'Descontinuado' : 'Estoque'
                                }
                                size="small"
                                color={
                                  computer.status === 'active' ? 'success' :
                                  computer.status === 'maintenance' ? 'warning' :
                                  computer.status === 'retired' ? 'error' : 'default'
                                }
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{computer.User?.name || '-'}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditComputer(computer)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteComputer(computer.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            Nenhum computador encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Container>
        </motion.div>

        {/* Diálogo para adicionar/editar computador */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentComputer ? 'Editar Computador' : 'Adicionar Computador'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Tipo"
                  >
                    <MenuItem value="notebook">Notebook</MenuItem>
                    <MenuItem value="desktop">Desktop</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="active">Ativo</MenuItem>
                    <MenuItem value="maintenance">Manutenção</MenuItem>
                    <MenuItem value="retired">Descontinuado</MenuItem>
                    <MenuItem value="stock">Estoque</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Modelo"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Série"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Processador"
                  name="processor"
                  value={formData.processor}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Memória"
                  name="memory"
                  value={formData.memory}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Armazenamento"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sistema Operacional"
                  name="operatingSystem"
                  value={formData.operatingSystem}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Compra"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiração da Garantia"
                  name="warrantyExpiration"
                  type="date"
                  value={formData.warrantyExpiration}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleSaveComputer}
              variant="contained"
              color="primary"
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para mensagens */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Computers;