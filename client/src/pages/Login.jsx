import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';

// Importar serviço de autenticação do Firebase
import { loginUser, getCurrentUser } from '../firebase/services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Usuário já autenticado, redirecionar para o dashboard
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Fazer login usando o Firebase
      const userData = await loginUser(email, password);
      
      // Salvar dados do usuário no localStorage para acesso fácil
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                AssetHUB
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Sistema de Gerenciamento de Ativos
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
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
                disabled={loading}
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
                disabled={loading}
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
              <Box sx={{ textAlign: 'center' }}>
                <Link href="/register" variant="body2">
                  Não tem uma conta? Registre-se
                </Link>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;