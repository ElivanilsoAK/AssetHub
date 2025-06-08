import AuthLayout from '../components/AuthLayout';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';

const Inventory = () => {
  return (
    <AuthLayout>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Barra lateral */}
        <Box sx={{ width: 240, borderRight: '1px solid #e0e0e0', p: 2 }}>
          <Button
            variant="contained"
            startIcon={<InventoryIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Inventário
          </Button>
        </Box>

        {/* Área principal */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Inventário
          </Typography>

          {/* Colunas superiores */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '200px' }}>
                <Typography variant="h6">Coluna 1</Typography>
                {/* Conteúdo da coluna 1 */}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '200px' }}>
                <Typography variant="h6">Coluna 2</Typography>
                {/* Conteúdo da coluna 2 */}
              </Paper>
            </Grid>
          </Grid>

          {/* Áreas retangulares inferiores */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: '250px' }}>
                <Typography variant="h6">Área Retangular 1</Typography>
                {/* Conteúdo da área 1 */}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: '250px' }}>
                <Typography variant="h6">Área Retangular 2</Typography>
                {/* Conteúdo da área 2 */}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Inventory;