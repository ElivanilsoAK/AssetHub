import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';

const InventoryNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="secondary"
      >
        <Tab value="/equipment/bags" label="Mochilas" />
        <Tab value="/equipment/computers" label="Computadores" />
        <Tab value="/equipment/mobile-devices" label="Dispositivos Móveis" />
        <Tab value="/equipment/printers" label="Impressoras" />
        <Tab value="/equipment/toners" label="Toners" />
      </Tabs>
    </Box>
  );
};

export default InventoryNavbar;