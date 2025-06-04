import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Importar a Sidebar
import { Box } from '@mui/material';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />
      <Box sx={{ flexGrow: 1, ml: '250px', p: 3 }}> {/* Ajuste o ml para o width da sidebar */}
        <Outlet /> {/* Aqui as rotas filhas serão renderizadas */}
      </Box>
    </Box>
  );
};

export default Layout;