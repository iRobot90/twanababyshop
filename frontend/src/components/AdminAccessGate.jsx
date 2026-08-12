import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Paper, Stack, TextField, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const ADMIN_EMAIL = 'admin@twana.com';
const ADMIN_PASSWORD = 'twana2024';

export default function AdminAccessGate({ children, title, subtitle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('twana_admin_auth');
    if (saved === 'true') {
      setAuthorized(true);
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('twana_admin_auth', 'true');
      setAuthorized(true);
      setError('');
      return;
    }

    setError('Use admin@twana.com / twana2024');
  };

  if (authorized) {
    return <Box>{children}</Box>;
  }

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, py: 8, background: 'linear-gradient(135deg, #f8fbf8 0%, #ffffff 100%)' }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 500, borderRadius: 4, p: { xs: 3, md: 4 }, bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 20px 45px rgba(0,0,0,0.08)' }}>
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <LockOutlined />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {title || 'Admin Access'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle || 'Sign in to manage products for the Twana storefront.'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Card variant="outlined" sx={{ width: '100%', borderRadius: 3, borderColor: 'rgba(0,0,0,0.08)' }}>
            <CardContent>
              <form onSubmit={handleLogin}>
                <Stack spacing={2}>
                  <TextField label="Email" type="email" fullWidth value={email} onChange={(event) => setEmail(event.target.value)} />
                  <TextField label="Password" type="password" fullWidth value={password} onChange={(event) => setPassword(event.target.value)} />
                  <Button type="submit" variant="contained" size="large">
                    Enter Admin Panel
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Stack>
      </Paper>
    </Box>
  );
}
