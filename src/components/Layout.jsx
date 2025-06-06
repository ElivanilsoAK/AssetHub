import { Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box
    
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(135deg, #6B2FB3 0%, #FF69B4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
      }}
    >
        
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          p: { xs: 2, sm: 3, md: 4 },
          width: '90%',
          maxWidth: '400px',
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        {children}
      </Box>
    </Box>
  );
};

export default Layout;