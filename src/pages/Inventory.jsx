import AuthLayout from '../components/AuthLayout';
import { Typography } from '@mui/material';

const Inventory = () => {
  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom>
        Inventário
      </Typography>
      {/* Conteúdo do inventário aqui */}
    </AuthLayout>
  );
};

export default Inventory;