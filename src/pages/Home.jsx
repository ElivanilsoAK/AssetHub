import { useState, useEffect } from 'react';
import { Typography, Paper, Box, AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('visitCount') || 0;
    const newCount = Number(storedCount) + 1;
    setVisitCount(newCount);
    localStorage.setItem('visitCount', newCount);
  }, []);

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

      <Box sx={{ flexGrow: 1, p: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Home
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            mb: 3,
            width: '100%',
            background: 'linear-gradient(135deg, #8B4FD3 0%, #FF89C4 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Contador de Visitas
          </Typography>
          <Typography variant="h3">
            {visitCount}
          </Typography>
        </Paper>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Esta página será implementada com mais funcionalidades posteriormente.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;