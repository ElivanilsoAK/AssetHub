import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importe Link aqui
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid // Importe Grid aqui
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Salvar token no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Envolva os elementos em um React.Fragment para ter um único elemento raiz
    <>
      <Container component="main" maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Paper
              elevation={3}
              className="glass-card"
              sx={{
                p: 4,
                width: '100%',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                }}
              >
                <LockOutlinedIcon />
              </Box>
              <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                AssetHUB
              </Typography>
              <Typography component="h2" variant="subtitle1" sx={{ mb: 3 }}>
                Gerenciamento de Inventário de TI
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Entrar'}
                </Button>
              </Box>
            </Paper>
          </Box>
        </motion.div>
      </Container>
      {/* O Link foi movido para fora do Container e dentro do Fragment */}
      <Grid container justifyContent="center" sx={{ mt: 2 }}> {/* Adicionei margem superior aqui para separar do formulário */}
        <Grid item>
          <Link to="/register" style={{ textDecoration: 'none', color: '#6a1b9a' }}>
            Não tem uma conta? Registre-se
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;