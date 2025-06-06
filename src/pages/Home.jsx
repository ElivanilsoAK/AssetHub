import { useState, useEffect } from 'react';
import AuthLayout from '../components/AuthLayout';
import { Typography, Paper } from '@mui/material';

const Home = () => {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('visitCount') || 0;
    const newCount = Number(storedCount) + 1;
    setVisitCount(newCount);
    localStorage.setItem('visitCount', newCount);
  }, []);

  return (
    <AuthLayout>
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
    </AuthLayout>
  );
};

export default Home;