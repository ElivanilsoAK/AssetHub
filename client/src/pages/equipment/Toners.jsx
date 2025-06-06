import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import {
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
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as EntryIcon,
  ArrowDownward as ExitIcon
} from '@mui/icons-material';

// Importar componentes base
import Layout2 from '../../components/Layout2';
import EquipmentBase from '../inventory/EquipmentBase';

// Importar serviços do Firebase
import { 
  fetchToners, 
  addToner, 
  updateToner, 
  deleteToner, 
  registerTonerMovement,
  fetchTonerMovements,
  getTonerStats
} from '../../firebase/services/tonerService';

const Toners = () => {
  // Estados para dados
  const [toners, setToners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [movements, setMovements] = useState([]);

  // Estados para formulários
  const [openEntryDialog, setOpenEntryDialog] = useState(false);
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [selectedToner, setSelectedToner] = useState(null);
  const [formData, setFormData] = useState({
    quantity: 1,
    department: '',
    notes: ''
  });

  // Buscar dados
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tonersData, statsData] = await Promise.all([
        fetchToners(),
        getTonerStats()
      ]);
      setToners(tonersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Renderizar estatísticas
  const renderStats = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total de Toners</Typography>
            <Typography variant="h4">{stats?.total || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Disponíveis</Typography>
            <Typography variant="h4" color="success.main">{stats?.available || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Em Uso</Typography>
            <Typography variant="h4" color="info.main">{stats?.inUse || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Baixados</Typography>
            <Typography variant="h4" color="error.main">{stats?.retired || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Renderizar formulário de entrada/saída
  const renderMovementForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Entrada de Toner</Typography>
          <Button
            variant="contained"
            startIcon={<EntryIcon />}
            onClick={() => setOpenEntryDialog(true)}
            fullWidth
          >
            Registrar Entrada
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Saída de Toner</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ExitIcon />}
            onClick={() => setOpenExitDialog(true)}
            fullWidth
          >
            Registrar Saída
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  // Renderizar histórico recente
  const renderRecentHistory = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Toner</TableCell>
            <TableCell>Departamento</TableCell>
            <TableCell>Notas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.slice(0, 10).map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{new Date(movement.timestamp).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip 
                  label={movement.type === 'entry' ? 'Entrada' : 'Saída'}
                  color={movement.type === 'entry' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{movement.tonerModel}</TableCell>
              <TableCell>{movement.department}</TableCell>
              <TableCell>{movement.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Layout2>
      <EquipmentBase title="Gerenciamento de Toners">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {renderStats()}
            </Grid>
            <Grid item xs={12}>
              {renderMovementForm()}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Histórico Recente</Typography>
              {renderRecentHistory()}
            </Grid>
          </Grid>
        )}
      </EquipmentBase>
    </Layout2>
  );
};

export default Toners;