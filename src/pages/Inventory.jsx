import { Box, Grid, Paper, Typography, Button, AppBar, Toolbar } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';

const Inventory = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
            AssetHub
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" component={Link} to="/home">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/inventory">
            Inventário
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Barra lateral */}
        <Box sx={{ width: 240, bgcolor: '#f5f5f5', p: 2 }}>
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
          <Grid container spacing={3}>
            {/* Colunas superiores */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '200px' }}>
                <Typography variant="h6">Coluna 1</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '200px' }}>
                <Typography variant="h6">Coluna 2</Typography>
              </Paper>
            </Grid>

            {/* Áreas retangulares inferiores */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: '250px' }}>
                <Typography variant="h6">Área Retangular 1</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: '250px' }}>
                <Typography variant="h6">Área Retangular 2</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Inventory;