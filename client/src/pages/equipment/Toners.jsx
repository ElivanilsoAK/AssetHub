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

const Toners = () => {
  const navigate = useNavigate();
  const [toners, setToners] = useState([]);
  const [loading, setLoading] = true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentToner, setCurrentToner] = useState(null);
  const [formData, setFormData] = useState({
    color: 'black', // Ex: black, cyan, magenta, yellow
    model: '',
    identificationCode: '',
    compatiblePrinters: '', // Pode ser uma string de modelos separados por vírgula
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
  const [filterColor, setFilterColor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Função para buscar os toners
  const fetchToners = useCallback(async () => {
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
      if (filterColor) {
        queryParams.append('color', filterColor);
      }
      if (filterStatus) {
        queryParams.append('status', filterStatus);
      }
      
      const url = `${API_BASE_URL}/equipment/toners?${queryParams.toString()}`; //

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToners(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar os toners:', err);
      setError('Erro ao carregar os toners: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, filterColor, filterStatus]);

  useEffect(() => {
    debouncedFetchToners(searchTerm, filterColor, filterStatus);
  }, [navigate, searchTerm, filterColor, filterStatus, debouncedFetchToners]);

  const debouncedFetchToners = useCallback(debounce(fetchToners, 500), [fetchToners]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToner = () => {
    setCurrentToner(null);
    setFormData({
      color: 'black',
      model: '',
      identificationCode: '',
      compatiblePrinters: '',
      purchaseDate: '',
      notes: '',
      status: 'available'
    });
    setOpenDialog(true);
  };

  const handleEditToner = (toner) => {
    setCurrentToner(toner);
    setFormData({
      color: toner.color,
      model: toner.model || '',
      identificationCode: toner.identificationCode,
      compatiblePrinters: toner.compatiblePrinters || '',
      purchaseDate: toner.purchaseDate ? new Date(toner.purchaseDate).toISOString().split('T')[0] : '',
      notes: toner.notes || '',
      status: toner.status
    });
    setOpenDialog(true);
  };

  const handleSaveToner = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (currentToner) {
        await axios.put(`${API_BASE_URL}/equipment/toners/${currentToner.id}`, formData, { headers }); //
        setSnackbar({
          open: true,
          message: 'Toner atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_BASE_URL}/equipment/toners`, formData, { headers }); //
        setSnackbar({
          open: true,
          message: 'Toner adicionado com sucesso!',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      debouncedFetchToners(searchTerm, filterColor, filterStatus);
    } catch (err) {
      console.error('Erro ao salvar toner:', err);
      setSnackbar({
        open: true,
        message: 'Erro: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    }
  };

  const handleDeleteToner = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este toner?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/equipment/toners/${id}`, { //
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Toner excluído com sucesso!',
          severity: 'success'
        });
        debouncedFetchToners(searchTerm, filterColor, filterStatus);
      } catch (err) {
        console.error('Erro ao excluir toner:', err);
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
              Toners
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToner}
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
                <InputLabel>Cor</InputLabel>
                <Select
                  name="filterColor"
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  label="Cor"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="black">Preto</MenuItem>
                  <MenuItem value="cyan">Ciano</MenuItem>
                  <MenuItem value="magenta">Magenta</MenuItem>
                  <MenuItem value="yellow">Amarelo</MenuItem>
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
                onClick={() => debouncedFetchToners(searchTerm, filterColor, filterStatus)}
              >
                Aplicar
              </Button>
              <IconButton onClick={() => debouncedFetchToners('', '', '')}>
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
                    <TableCell>Cor</TableCell>
                    <TableCell>Modelo</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Compatível</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {toners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhum toner cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    toners.map((toner) => (
                      <TableRow key={toner.id}>
                        <TableCell>
                          <Chip 
                            label={toner.color === 'black' ? 'Preto' : toner.color === 'cyan' ? 'Ciano' : toner.color === 'magenta' ? 'Magenta' : 'Amarelo'}
                            color={toner.color === 'black' ? 'default' : 'primary'} // Cores genéricas para CMY
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{toner.model || '-'}</TableCell>
                        <TableCell>{toner.identificationCode}</TableCell>
                        <TableCell>{toner.compatiblePrinters || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={toner.status === 'available' ? 'Disponível' : 
                                  toner.status === 'in_use' ? 'Em Uso' : 
                                  toner.status === 'maintenance' ? 'Em Manutenção' : 'Descartado'}
                            color={toner.status === 'available' ? 'success' : 
                                  toner.status === 'in_use' ? 'primary' : 
                                  toner.status === 'maintenance' ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditToner(toner)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteToner(toner.id)}>
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

      {/* Dialog para adicionar/editar toner */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentToner ? 'Editar Toner' : 'Adicionar Toner'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cor</InputLabel>
                <Select
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  label="Cor"
                >
                  <MenuItem value="black">Preto</MenuItem>
                  <MenuItem value="cyan">Ciano</MenuItem>
                  <MenuItem value="magenta">Magenta</MenuItem>
                  <MenuItem value="yellow">Amarelo</MenuItem>
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
                name="model"
                label="Modelo"
                value={formData.model}
                onChange={handleFormChange}
                fullWidth
                required
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
                name="compatiblePrinters"
                label="Impressoras Compatíveis (separadas por vírgula)"
                value={formData.compatiblePrinters}
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
          <Button onClick={handleSaveToner} variant="contained" color="primary">
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

export default Toners;