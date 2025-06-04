import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
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
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; //

const MobileDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [formData, setFormData] = useState({
    type: 'smartphone', // Ex: smartphone, tablet, smartwatch
    brand: '',
    model: '',
    identificationCode: '',
    operatingSystem: '',
    serialNumber: '',
    purchaseDate: '',
    notes: '',
    status: 'available'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Função para buscar os dispositivos móveis
  const fetchMobileDevices = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      if (filterType) {
        queryParams.append('type', filterType);
      }
      if (filterStatus) {
        queryParams.append('status', filterStatus);
      }
      
      const url = `${API_BASE_URL}/equipment/mobile-devices?${queryParams.toString()}`; //

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDevices(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar os dispositivos móveis:', err);
      setError('Erro ao carregar os dispositivos móveis: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    debouncedFetchMobileDevices(searchTerm, filterType, filterStatus);
  }, [navigate, searchTerm, filterType, filterStatus, debouncedFetchMobileDevices]);

  const debouncedFetchMobileDevices = useCallback(debounce(fetchMobileDevices, 500), [fetchMobileDevices]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDevice = () => {
    setCurrentDevice(null);
    setFormData({
      type: 'smartphone',
      brand: '',
      model: '',
      identificationCode: '',
      operatingSystem: '',
      serialNumber: '',
      purchaseDate: '',
      notes: '',
      status: 'available'
    });
    setOpenDialog(true);
  };

  const handleEditDevice = (device) => {
    setCurrentDevice(device);
    setFormData({
      type: device.type,
      brand: device.brand,
      model: device.model || '',
      identificationCode: device.identificationCode,
      operatingSystem: device.operatingSystem || '',
      serialNumber: device.serialNumber || '',
      purchaseDate: device.purchaseDate ? new Date(device.purchaseDate).toISOString().split('T')[0] : '',
      notes: device.notes || '',
      status: device.status
    });
    setOpenDialog(true);
  };

  const handleSaveDevice = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (currentDevice) {
        await axios.put(`${API_BASE_URL}/equipment/mobile-devices/${currentDevice.id}`, formData, { headers }); //
        setSnackbar({
          open: true,
          message: 'Dispositivo móvel atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_BASE_URL}/equipment/mobile-devices`, formData, { headers }); //
        setSnackbar({
          open: true,
          message: 'Dispositivo móvel adicionado com sucesso!',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      debouncedFetchMobileDevices(searchTerm, filterType, filterStatus);
    } catch (err) {
      console.error('Erro ao salvar dispositivo móvel:', err);
      setSnackbar({
        open: true,
        message: 'Erro: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    }
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este dispositivo móvel?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/equipment/mobile-devices/${id}`, { //
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Dispositivo móvel excluído com sucesso!',
          severity: 'success'
        });
        debouncedFetchMobileDevices(searchTerm, filterType, filterStatus);
      } catch (err) {
        console.error('Erro ao excluir dispositivo móvel:', err);
        setSnackbar({
          open: true,
          message: 'Erro ao excluir: ' + (err.response?.data?.message || err.message),
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dispositivos Móveis
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDevice}
              startIcon={<AddIcon />}
            >
              Adicionar
            </Button>
          </Box>

          <Paper sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Buscar..."
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1, minWidth: 200 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="smartphone">Smartphone</MenuItem>
                  <MenuItem value="tablet">Tablet</MenuItem>
                  <MenuItem value="smartwatch">Smartwatch</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="available">Disponível</MenuItem>
                  <MenuItem value="in_use">Em Uso</MenuItem>
                  <MenuItem value="maintenance">Em Manutenção</MenuItem>
                  <MenuItem value="discarded">Descartado</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => debouncedFetchMobileDevices(searchTerm, filterType, filterStatus)}
              >
                Aplicar
              </Button>
              <IconButton onClick={() => debouncedFetchMobileDevices('', '', '')}> {/* Limpa filtros e busca */}
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
                    <TableCell>SO</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Nenhum dispositivo móvel cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <Chip 
                            label={device.type === 'smartphone' ? 'Smartphone' : device.type === 'tablet' ? 'Tablet' : 'Smartwatch'}
                            color={device.type === 'smartphone' ? 'primary' : device.type === 'tablet' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{device.brand}</TableCell>
                        <TableCell>{device.model || '-'}</TableCell>
                        <TableCell>{device.identificationCode}</TableCell>
                        <TableCell>{device.operatingSystem || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={device.status === 'available' ? 'Disponível' : 
                                  device.status === 'in_use' ? 'Em Uso' : 
                                  device.status === 'maintenance' ? 'Em Manutenção' : 'Descartado'}
                            color={device.status === 'available' ? 'success' : 
                                  device.status === 'in_use' ? 'primary' : 
                                  device.status === 'maintenance' ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditDevice(device)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteDevice(device.id)}>
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

      {/* Dialog para adicionar/editar dispositivo móvel */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentDevice ? 'Editar Dispositivo Móvel' : 'Adicionar Dispositivo Móvel'}</DialogTitle>
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
                  <MenuItem value="smartphone">Smartphone</MenuItem>
                  <MenuItem value="tablet">Tablet</MenuItem>
                  <MenuItem value="smartwatch">Smartwatch</MenuItem>
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
                name="operatingSystem"
                label="Sistema Operacional"
                value={formData.operatingSystem}
                onChange={handleFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="serialNumber"
                label="Número de Série"
                value={formData.serialNumber}
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
          <Button onClick={handleSaveDevice} variant="contained" color="primary">
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

export default MobileDevices;