import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Skeleton, Alert, IconButton, Tooltip } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import api from '../api';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`products/${slug}/`);
        setProduct(response.data);
        // Set default color if available
        if (response.data.colors) {
          const colors = response.data.colors.split(',');
          if (colors.length > 0) setSelectedColor(colors[0].trim());
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" width={150} height={50} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error || 'Product not found'}</Alert>
        <Button component={Link} to="/shop" variant="contained">Back to Shop</Button>
      </Container>
    );
  }

  const colors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 3,
              cursor: 'crosshair',
              height: 500,
              bgcolor: 'background.paper'
            }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Box
              component="img"
              src={product.image || '/images/category-placeholder.jpg'}
              alt={product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZoomed ? 'scale(2)' : 'scale(1)',
                transition: 'transform 0.1s ease-out'
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Hover image to zoom
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="overline" color="text.secondary">
            {product.category?.name || 'Category'}
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            ${Number(product.price).toFixed(2)}
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary', my: 3 }}>
            {product.description}
          </Typography>

          {/* Color Selection */}
          {colors.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Select Color: {selectedColor}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {colors.map((color) => (
                  <Tooltip key={color} title={color}>
                    <Box
                      onClick={() => setSelectedColor(color)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: color.toLowerCase(),
                        border: selectedColor === color ? '3px solid #000' : '1px solid #ddd',
                        cursor: 'pointer',
                        boxShadow: selectedColor === color ? 3 : 1,
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => addToCart({ ...product, selectedColor })}
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
