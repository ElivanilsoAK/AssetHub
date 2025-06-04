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

const Printers = () => {
  const navigate = useNavigate();
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPrinter, setCurrentPrinter] = useState(null);
  const [formData, setFormData] = useState({
    type: 'laser', // Ex: laser, inkjet, matricial
    brand: '',
    model: '',
    identificationCode: '',
    serialNumber: '',
    ipAddress: '',
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

  // Função para buscar as impressoras
  const fetchPrinters = useCallback(async () => {
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
      
      const url = `${API_BASE_URL}/equipment/printers?${queryParams.toString()}`; //

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrinters(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar as impressoras:', err);
      setError('Erro ao carregar as impressoras: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    debouncedFetchPrinters(searchTerm, filterType, filterStatus);
  }, [navigate, searchTerm, filterType, filterStatus, debouncedFetchPrinters]);

  const debouncedFetchPrinters = useCallback(debounce(fetchPrinters, 500), [fetchPrinters]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPrinter = () => {
    setCurrentPrinter(null);
    setFormData({
      type: 'laser',
      brand: '',
      model: '',
      identificationCode: '',
      serialNumber: '',
      ipAddress: '',
      purchaseDate: '',
      notes: '',
      status: 'available'
    });
    setOpenDialog(true);
  };

  const handleEditPrinter = (printer) => {
    setCurrentPrinter(printer);
    setFormData({
      type: printer.type,
      brand: printer.brand,
      model: printer.model || '',
      identificationCode: printer.identificationCode,
      serialNumber: printer.serialNumber || '',
      ipAddress: printer.ipAddress || '',
      purchaseDate: printer.purchaseDate ? new Date(printer.purchaseDate).toISOString().split('T')[0] : '',
      notes: printer.notes || '',
      status: printer.status
    });
    setOpenDialog(true);
  };

  const handleSavePrinter = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (currentPrinter) {
        await axios.put(`${API_BASE_URL}/equipment/printers/${currentPrinter.id}`, formData, { headers }); //
        setSnackbar({
          open: true,
          message: 'Impressora atualizada com sucesso!',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_BASE_URL}/equipment/printers`, formData, { headers }); //
        setSnackbar({
          open: true,
          message: 'Impressora adicionada com sucesso!',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      debouncedFetchPrinters(searchTerm, filterType, filterStatus);
    } catch (err) {
      console.error('Erro ao salvar impressora:', err);
      setSnackbar({
        open: true,
        message: 'Erro: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    }
  };

  const handleDeletePrinter = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta impressora?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/equipment/printers/${id}`, { //
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Impressora excluída com sucesso!',
          severity: 'success'
        });
        debouncedFetchPrinters(searchTerm, filterType, filterStatus);
      } catch (err) {
        console.error('Erro ao excluir impressora:', err);
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
              Impressoras
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPrinter}
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
                  onChange={handleFilterTypeChange}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="laser">Laser</MenuItem>
                  <MenuItem value="inkjet">Jato de Tinta</MenuItem>
                  <MenuItem value="matricial">Matricial</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="filterStatus"
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
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
                onClick={() => debouncedFetchPrinters(searchTerm, filterType, filterStatus)}
              >
                Aplicar
              </Button>
              <IconButton onClick={() => debouncedFetchPrinters('', '', '')}>
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
                    <TableCell>IP</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Nenhuma impressora cadastrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    printers.map((printer) => (
                      <TableRow key={printer.id}>
                        <TableCell>
                          <Chip 
                            label={printer.type === 'laser' ? 'Laser' : printer.type === 'inkjet' ? 'Jato de Tinta' : 'Matricial'}
                            color={printer.type === 'laser' ? 'primary' : printer.type === 'inkjet' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{printer.brand}</TableCell>
                        <TableCell>{printer.model || '-'}</TableCell>
                        <TableCell>{printer.identificationCode}</TableCell>
                        <TableCell>{printer.ipAddress || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={printer.status === 'available' ? 'Disponível' : 
                                  printer.status === 'in_use' ? 'Em Uso' : 
                                  printer.status === 'maintenance' ? 'Em Manutenção' : 'Descartado'}
                            color={printer.status === 'available' ? 'success' : 
                                  printer.status === 'in_use' ? 'primary' : 
                                  printer.status === 'maintenance' ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditPrinter(printer)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeletePrinter(printer.id)}>
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

      {/* Dialog para adicionar/editar impressora */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentPrinter ? 'Editar Impressora' : 'Adicionar Impressora'}</DialogTitle>
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
                  <MenuItem value="laser">Laser</MenuItem>
                  <MenuItem value="inkjet">Jato de Tinta</MenuItem>
                  <MenuItem value="matricial">Matricial</MenuItem>
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
                name="serialNumber"
                label="Número de Série"
                value={formData.serialNumber}
                onChange={handleFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ipAddress"
                label="Endereço IP"
                value={formData.ipAddress}
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
          <Button onClick={handleSavePrinter} variant="contained" color="primary">
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

export default Printers;