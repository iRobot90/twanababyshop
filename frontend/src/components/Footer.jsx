import React from 'react';
import { Box, Container, Grid, Typography, TextField, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        pt: 8,
        pb: 4,
        mt: 'auto',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h5" 
                component={RouterLink} 
                to="/"
                sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  textDecoration: 'none',
                  display: 'block',
                  mb: 2,
                  '&:hover': { color: '#1a365d' }
                }}
              >
                TwanaBabyShop
              </Typography>
              <Typography variant="body1" color="#6c757d" sx={{ mb: 3, lineHeight: 1.7 }}>
                Nurturing little lives with love and care. Your trusted partner for premium baby essentials in Kenya.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <IconButton 
                  href="https://facebook.com" 
                  target="_blank" 
                  sx={{ 
                    color: '#4267B2',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '&:hover': { backgroundColor: '#f0f2f5' }
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  href="https://instagram.com" 
                  target="_blank"
                  sx={{ 
                    color: '#E1306C',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '&:hover': { backgroundColor: '#fdf2f6' }
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  href="https://twitter.com" 
                  target="_blank"
                  sx={{ 
                    color: '#1DA1F2',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '&:hover': { backgroundColor: '#f0f8ff' }
                  }}
                >
                  <Twitter />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { text: 'New Arrivals', to: '/new-arrivals' },
                { text: 'Best Sellers', to: '/best-sellers' },
                { text: 'On Sale', to: '/sale' },
                { text: 'Gift Cards', to: '/gift-cards' },
                { text: 'Lookbook', to: '/lookbook' }
              ].map((item) => (
                <Typography
                  key={item.text}
                  component={RouterLink}
                  to={item.to}
                  sx={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#2c3e50' }
                  }}
                >
                  {item.text}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { text: 'Clothing', to: '/category/clothing' },
                { text: 'Toys', to: '/category/toys' },
                { text: 'Nursery', to: '/category/nursery' },
                { text: 'Feeding', to: '/category/feeding' },
                { text: 'Bath & Care', to: '/category/bath-care' }
              ].map((item) => (
                <Typography
                  key={item.text}
                  component={RouterLink}
                  to={item.to}
                  sx={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#2c3e50' }
                  }}
                >
                  {item.text}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" color="#6c757d" sx={{ mb: 2 }}>
              Subscribe to our newsletter for the latest updates and offers.
            </Typography>
            <Box component="form" sx={{ display: 'flex', mb: 3 }}>
              <TextField
                size="small"
                placeholder="Your email"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '4px 0 0 4px',
                    '& fieldset': {
                      borderColor: '#dee2e6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#adb5bd',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: '0 4px 4px 0',
                  backgroundColor: '#4a90e2',
                  '&:hover': {
                    backgroundColor: '#357abd',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <LocationOn sx={{ color: '#6c757d', mr: 1.5 }} />
                <Typography variant="body2" color="#6c757d">
                  Nairobi, Kenya
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Phone sx={{ color: '#6c757d', mr: 1.5 }} />
                <Typography variant="body2" color="#6c757d">
                  +254 700 000 000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ color: '#6c757d', mr: 1.5 }} />
                <Typography variant="body2" color="#6c757d">
                  hello@twanababyshop.co.ke
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ 
          mt: 6, 
          pt: 3, 
          borderTop: '1px solid rgba(0,0,0,0.05)',
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color="#6c757d">
            © {new Date().getFullYear()} TwanaBabyShop. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={RouterLink}
              to="/privacy"
              variant="body2"
              sx={{
                color: '#6c757d',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#2c3e50' }
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              component={RouterLink}
              to="/terms"
              variant="body2"
              sx={{
                color: '#6c757d',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#2c3e50' }
              }}
            >
              Terms of Service
            </Typography>
            <Typography
              component={RouterLink}
              to="/shipping"
              variant="body2"
              sx={{
                color: '#6c757d',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#2c3e50' }
              }}
            >
              Shipping & Returns
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
