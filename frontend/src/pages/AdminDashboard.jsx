import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { ArrowForward, Inventory2Outlined, LocalOfferOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminAccessGate from '../components/AdminAccessGate';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [lastProduct, setLastProduct] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('twana_last_product');
    if (saved) {
      setLastProduct(JSON.parse(saved));
    }
  }, []);

  return (
    <AdminAccessGate title="Twana Admin" subtitle="Manage your baby shop from the same premium storefront experience.">
      <Box sx={{ maxWidth: 1160, mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
              TWANA ADMIN
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Product Dashboard
            </Typography>
          </Box>
          <Button variant="contained" size="large" endIcon={<ArrowForward />} onClick={() => navigate('/admin/create-products')}>
            Add Product
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ flex: 1, borderRadius: 4, boxShadow: '0 20px 45px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <Inventory2Outlined color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Inventory Control</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Upload product images, add discounts, and manage your catalog from a polished admin workspace that feels like the storefront.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" onClick={() => navigate('/admin/create-products')}>Upload Product</Button>
                <Button variant="outlined" onClick={() => navigate('/shop')}>View Shop</Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, borderRadius: 4, boxShadow: '0 20px 45px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <LocalOfferOutlined color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Latest Saved Product</Typography>
              </Box>
              {lastProduct ? (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{lastProduct.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{lastProduct.description}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                    <Chip label={`Category: ${lastProduct.category}`} color="primary" variant="outlined" />
                    <Chip label={`Discount: ${Number(lastProduct.discount || 0)}%`} color="secondary" variant="outlined" />
                  </Stack>
                  <Typography variant="body2">Base Price: ${Number(lastProduct.price).toFixed(2)}</Typography>
                  <Typography variant="body2">Final Price: ${Number(lastProduct.finalPrice || 0).toFixed(2)}</Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No product has been saved yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </AdminAccessGate>
  );
}
