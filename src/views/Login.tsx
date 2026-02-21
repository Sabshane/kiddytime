import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { hasPassword, login, setPassword } = useAuth();
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasPassword) {
      // Setting up first-time password
      if (password.length < 4) {
        setError('Le mot de passe doit contenir au moins 4 caractères');
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      await setPassword(password);
    } else {
      // Login
      const success = await login(password);
      if (!success) {
        setError('Mot de passe incorrect');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={24} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
              KiddyTime
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {hasPassword ? '🔐 Connexion' : '🎉 Créer un mot de passe'}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPasswordInput(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {!hasPassword && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 24px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              {hasPassword ? '🚀 Se connecter' : '✨ Créer le mot de passe'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
