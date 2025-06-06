import { Box } from '@mui/material';
import Navbar from './Navbar';

const AuthLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #6B2FB3 0%, #FF69B4 100%)',
          minHeight: '100vh',
          pt: 8,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
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
            maxWidth: '1200px',
            my: 4,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;