// client/src/pages/equipment/Bags.jsx
import { useState, useEffect, useCallback } from 'react'; //
import { useNavigate } from 'react-router-dom'; //
import axios from 'axios'; //
import { motion } from 'framer-motion'; //
import debounce from 'lodash.debounce'; // Importado para funcionalidade de busca/filtro com atraso

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
  CircularProgress,   // Importado
  InputAdornment,     // Importado
  // Avatar não é mais necessário aqui se a Sidebar for um componente separado.
  // Se a Sidebar estiver neste arquivo ou Avatar for usado diretamente aqui, importe:
  // Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  // Ícones de navegação não são mais necessários aqui se a Sidebar for um componente separado.
  // Dashboard as DashboardIcon,
  // Inventory as InventoryIcon,
  // Assessment as ReportsIcon,
  // Settings as SettingsIcon,
  // ExitToApp as LogoutIcon,
  Search as SearchIcon, //
  FilterList as FilterIcon, //
  Refresh as RefreshIcon, //
  Add as AddIcon // Importado
} from '@mui/icons-material';

// Define a URL base da API usando a variável de ambiente do Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Bags = () => {
  const navigate = useNavigate(); //
  const [bags, setBags] = useState([]); //
  const [loading, setLoading] = useState(true); //
  const [error, setError] = useState(null); //
  const [openDialog, setOpenDialog] = useState(false); //
  const [currentBag, setCurrentBag] = useState(null); //
  const [formData, setFormData] = useState({ //
    type: 'backpack',
    brand: '',
    model: '',
    identificationCode: '',
    color: '',
    purchaseDate: '',
    notes: '',
    status: 'available'
  });
  const [snackbar, setSnackbar] = useState({ //
    open: false,
    message: '',
    severity: 'success'
  });

  // Novos estados para busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Função para buscar as mochilas, agora com suporte a busca e filtros
  const fetchBags = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redireciona se não houver token
        return;
      }

      // Constrói os parâmetros de consulta
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
      
      const url = `${API_BASE_URL}/equipment/bags?${queryParams.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBags(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar as mochilas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, filterType, filterStatus]); // Dependências para useCallback

  // Usa useEffect para carregar as mochilas na montagem e quando os filtros/busca mudam
  useEffect(() => {
    // A verificação de token é essencial aqui.
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Chama a versão debounced da função de busca ao montar ou quando os filtros/busca mudam
    debouncedFetchBags(searchTerm, filterType, filterStatus);
  }, [navigate, searchTerm, filterType, filterStatus, debouncedFetchBags]);

  // Versão "debounced" da função fetchBags para evitar múltiplas chamadas à API
  const debouncedFetchBags = useCallback(debounce(fetchBags, 500), [fetchBags]);

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
      // Formata a data para 'YYYY-MM-DD' para o input type="date"
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
        await axios.put(`${API_BASE_URL}/equipment/bags/${currentBag.id}`, formData, { headers });
        setSnackbar({
          open: true,
          message: 'Mochila atualizada com sucesso!',
          severity: 'success'
        });
      } else {
        // Criar nova mochila
        await axios.post(`${API_BASE_URL}/equipment/bags`, formData, { headers });
        setSnackbar({
          open: true,
          message: 'Mochila adicionada com sucesso!',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      debouncedFetchBags(searchTerm, filterType, filterStatus); // Recarrega com os filtros/busca atuais
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
        await axios.delete(`${API_BASE_URL}/equipment/bags/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Mochila excluída com sucesso!',
          severity: 'success'
        });
        debouncedFetchBags(searchTerm, filterType, filterStatus); // Recarrega com os filtros/busca atuais
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Erro ao excluir: ' + (err.response?.data?.message || err.message),
          severity: 'error'
        });
      }
    }
  };

  // A função handleLogout foi movida para o componente Sidebar ou Layout.
  // Não é mais necessária aqui se a Sidebar for um componente separado.
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   navigate('/login');
  // };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box> {/* Remove o display: 'flex' e ml: '250px' daqui, agora gerenciado pelo Layout */}
      {/* A Sidebar não é mais renderizada diretamente aqui, ela é parte do Layout */}
      {/* <Sidebar onLogout={handleLogout} /> */}
      
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Buscar..."
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1, minWidth: 200 }}
                value={searchTerm}
                onChange={handleSearchChange}
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
                  <MenuItem value="backpack">Mochila</MenuItem>
                  <MenuItem value="case">Case</MenuItem>
                  <MenuItem value="bag">Bolsa</MenuItem>
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
              {/* O botão "Aplicar Filtros" é menos crítico com o debounce, mas pode ser mantido para UX explícita */}
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => debouncedFetchBags(searchTerm, filterType, filterStatus)}
              >
                Aplicar
              </Button>
              <IconButton onClick={() => debouncedFetchBags(searchTerm, filterType, filterStatus)}>
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
                            color={bag.status === 'available' ? 'primary' : bag.type === 'case' ? 'secondary' : 'default'} // Ajuste de cor
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