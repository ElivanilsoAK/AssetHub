import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ background: 'linear-gradient(90deg, #6B2FB3 0%, #FF69B4 100%)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AssetHub
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            onClick={() => navigate('/home')}
            sx={{ mx: 1, fontWeight: location.pathname === '/home' ? 'bold' : 'normal' }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/inventory')}
            sx={{ mx: 1, fontWeight: location.pathname === '/inventory' ? 'bold' : 'normal' }}
          >
            Inventário
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;