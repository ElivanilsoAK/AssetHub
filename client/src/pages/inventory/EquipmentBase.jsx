import { useState } from 'react';
import { Grid, Paper, Typography, Button, Dialog } from '@mui/material';

const EquipmentBase = ({ title, children }) => {
  const [openHistory, setOpenHistory] = useState(false);

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">{title}</Typography>
            <Button variant="contained" onClick={() => setOpenHistory(true)}>
              Ver Histórico Completo
            </Button>
          </Paper>
        </Grid>
        {children}
      </Grid>

      <Dialog
        fullWidth
        maxWidth="lg"
        open={openHistory}
        onClose={() => setOpenHistory(false)}
      >
        {/* Implementar visualização do histórico completo aqui */}
      </Dialog>
    </>
  );
};

export default EquipmentBase;