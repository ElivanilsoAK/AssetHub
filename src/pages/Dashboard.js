import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [inventorySummary, setInventorySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const summary = await window.electron.reports.getInventorySummary();
        setInventorySummary(summary);
      } catch (error) {
        console.error('Erro ao carregar resumo do inventário:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Dados de exemplo para demonstração
  const demoData = {
    printers: { total: 15, active: 12, maintenance: 3 },
    toners: { total: 45, inStock: 32, empty: 13 },
    notebooks: { total: 50, active: 48, maintenance: 2 },
    smartphones: { total: 30, active: 28, maintenance: 2 },
    bags: { total: 40, assigned: 35, available: 5 },
    tools: { total: 25, assigned: 20, available: 5 },
    serviceOrders: { total: 10, open: 5, closed: 5 }
  };

  const data = inventorySummary || demoData;

  const inventoryChartData = {
    labels: ['Impressoras', 'Toners', 'Notebooks', 'Celulares', 'Mochilas', 'Ferramentas'],
    datasets: [
      {
        label: 'Total',
        data: [
          data.printers.total,
          data.toners.total,
          data.notebooks.total,
          data.smartphones.total,
          data.bags.total,
          data.tools.total
        ],
        backgroundColor: 'rgba(94, 53, 177, 0.7)',
      },
    ],
  };

  const serviceOrdersData = {
    labels: ['Abertas', 'Fechadas'],
    datasets: [
      {
        data: [data.serviceOrders.open, data.serviceOrders.closed],
        backgroundColor: [
          'rgba(236, 64, 122, 0.7)',
          'rgba(94, 53, 177, 0.7)',
        ],
        borderColor: [
          'rgba(236, 64, 122, 1)',
          'rgba(94, 53, 177, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Cards de resumo */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Impressoras
              </Typography>
              <Typography variant="h5" component="div">
                {data.printers.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.printers.active} ativas, {data.printers.maintenance} em manutenção
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toners
              </Typography>
              <Typography variant="h5" component="div">
                {data.toners.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.toners.inStock} em estoque, {data.toners.empty} vazios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Notebooks
              </Typography>
              <Typography variant="h5" component="div">
                {data.notebooks.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.notebooks.active} ativos, {data.notebooks.maintenance} em manutenção
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ordens de Serviço
              </Typography>
              <Typography variant="h5" component="div">
                {data.serviceOrders.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.serviceOrders.open} abertas, {data.serviceOrders.closed} fechadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Gráficos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Inventário
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={inventoryChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ordens de Serviço
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie 
                data={serviceOrdersData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;