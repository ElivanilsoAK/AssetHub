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
  CircularProgress,
  InputAdornment,  
  Avatar           
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Componente Sidebar reutilizável
const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obter informações do usuário do localStorage
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
        color: 'white'
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

const Bags = () => {
  const navigate = useNavigate();
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBag, setCurrentBag] = useState(null);
  const [formData, setFormData] = useState({
    type: 'backpack',
    brand: '',
    model: '',
    identificationCode: '',
    color: '',
    purchaseDate: '',
    notes: '',
    status: 'available'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchBags();
  }, [navigate]);

  const fetchBags = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/equipment/bags', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBags(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar as mochilas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBag = () => {
    setCurrentBag(null);
    setFormData({
      type: 'backpack',
      brand: '',
      model: '',
      identificationCode: '',
      color: '',
      purchaseDate: '',
      notes: '',
      status: 'available'
    });
    setOpenDialog(true);
  };

  const handleEditBag = (bag) => {
    setCurrentBag(bag);
    setFormData({
      type: bag.type,
      brand: bag.brand,
      model: bag.model || '',
      identificationCode: bag.identificationCode,
      color: bag.color || '',
      purchaseDate: bag.purchaseDate ? new Date(bag.purchaseDate).toISOString().split('T')[0] : '',
      notes: bag.notes || '',
      status: bag.status
    });
    setOpenDialog(true);
  };

  const handleSaveBag = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (currentBag) {
        // Atualizar mochila existente
        await axios.put(`http://localhost:5000/api/equipment/bags/${currentBag.id}`, formData, { headers });
        setSnackbar({
          open: true,
          message: 'Mochila atualizada com sucesso!',
          severity: 'success'
        });
      } else {
        // Criar nova mochila
        await axios.post('http://localhost:5000/api/equipment/bags', formData, { headers });
        setSnackbar({
          open: true,
          message: 'Mochila adicionada com sucesso!',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      fetchBags();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    }
  };

  const handleDeleteBag = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta mochila?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/equipment/bags/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Mochila excluída com sucesso!',
          severity: 'success'
        });
        fetchBags();
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Erro ao excluir: ' + (err.response?.data?.message || err.message),
          severity: 'error'
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />
      
      <Box sx={{ flexGrow: 1, ml: '250px', p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Mochilas e Cases
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddBag}
                startIcon={<AddIcon />}
              >
                Adicionar
              </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  placeholder="Buscar..."
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, flexGrow: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{ mr: 1 }}
                >
                  Filtros
                </Button>
                <IconButton onClick={fetchBags}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Paper>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell>Modelo</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell>Cor</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bags.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          Nenhuma mochila cadastrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      bags.map((bag) => (
                        <TableRow key={bag.id}>
                          <TableCell>
                            <Chip 
                              label={bag.type === 'backpack' ? 'Mochila' : bag.type === 'case' ? 'Case' : 'Bolsa'}
                              color={bag.type === 'backpack' ? 'primary' : bag.type === 'case' ? 'secondary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{bag.brand}</TableCell>
                          <TableCell>{bag.model || '-'}</TableCell>
                          <TableCell>{bag.identificationCode}</TableCell>
                          <TableCell>{bag.color || '-'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={bag.status === 'available' ? 'Disponível' : 
                                    bag.status === 'in_use' ? 'Em Uso' : 
                                    bag.status === 'maintenance' ? 'Em Manutenção' : 'Descartado'}
                              color={bag.status === 'available' ? 'success' : 
                                    bag.status === 'in_use' ? 'primary' : 
                                    bag.status === 'maintenance' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleEditBag(bag)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteBag(bag.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Container>
        </motion.div>
      </Box>

      {/* Dialog para adicionar/editar mochila */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentBag ? 'Editar Mochila' : 'Adicionar Mochila'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  label="Tipo"
                >
                  <MenuItem value="backpack">Mochila</MenuItem>
                  <MenuItem value="case">Case</MenuItem>
                  <MenuItem value="bag">Bolsa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="available">Disponível</MenuItem>
                  <MenuItem value="in_use">Em Uso</MenuItem>
                  <MenuItem value="maintenance">Em Manutenção</MenuItem>
                  <MenuItem value="discarded">Descartado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="brand"
                label="Marca"
                value={formData.brand}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="model"
                label="Modelo"
                value={formData.model}
                onChange={handleFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="identificationCode"
                label="Código de Identificação"
                value={formData.identificationCode}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="color"
                label="Cor"
                value={formData.color}
                onChange={handleFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="purchaseDate"
                label="Data de Compra"
                type="date"
                value={formData.purchaseDate}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Observações"
                value={formData.notes}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveBag} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bags;