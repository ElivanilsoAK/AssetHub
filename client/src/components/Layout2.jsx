import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container, Grid, Paper } from '@mui/material';
import InventoryNavbar from './InventoryNavbar';

const Layout2 = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <InventoryNavbar />
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Estatísticas */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Typography variant="h6">Estatísticas</Typography>
                {/* Aqui virão os cards de estatísticas */}
              </Paper>
            </Grid>
            
            {/* Área principal de conteúdo */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">Entrada/Saída de Equipamento</Typography>
                {/* Formulário de entrada/saída */}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">Histórico Recente</Typography>
                {/* Lista de últimas 10 movimentações */}
              </Paper>
            </Grid>
          </Grid>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout2;