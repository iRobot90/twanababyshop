import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper, styled, IconButton, CircularProgress } from '@mui/material';
import { ShoppingCart, LocalShipping, GppGood, Favorite, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8000/api';

// Mock categories for now - we'll replace this with API data later
const categories = [
  { id: 1, name: 'Clothing', slug: 'clothing', image: '/images/categories/clothing.jpg' },
  { id: 2, name: 'Toys', slug: 'toys', image: '/images/categories/toys.jpg' },
  { id: 3, name: 'Feeding', slug: 'feeding', image: '/images/categories/feeding.jpg' },
  { id: 4, name: 'Nursery', slug: 'nursery', image: '/images/categories/nursery.jpg' },
];

// Product Card Component
const ProductCard = ({ product }) => (
  <Paper
    component={motion.div}
    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}
  >
    <Box
      sx={{
        pt: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={product.image || '/images/placeholder-product.jpg'}
        alt={product.name}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
    <Box p={2}>
      <Typography variant="h6" component="h3" gutterBottom noWrap>
        {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {product.description?.substring(0, 100)}...
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="primary">
          ${product.price}
        </Typography>
        <Button
          component={Link}
          to={`/product/${product.slug}`}
          variant="contained"
          size="small"
          startIcon={<ShoppingCart />}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  </Paper>
);

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(20, 2, 15),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  maxWidth: '800px',
  margin: '0 auto',
  '& h1': {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    lineHeight: 1.2,
    marginBottom: theme.spacing(3),
  },
  '& .MuiButton-root': {
    margin: theme.spacing(1),
    minWidth: '160px',
  },
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
  '& .card-media': {
    height: 300,
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    backgroundColor: theme.palette.grey[800], // Dark background for media area
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)', // Slightly darker gradient
    },
  },
  '& .card-content': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(3),
    textAlign: 'center',
    zIndex: 1,
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
  '& .MuiSvgIcon-root': {
    fontSize: 60,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
}));

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(categories.length / itemsPerPage));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(categories.length / itemsPerPage)) % Math.ceil(categories.length / itemsPerPage));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleCategories = categories.slice(
    currentSlide * itemsPerPage,
    (currentSlide + 1) * itemsPerPage
  );

  // Handle case where we have fewer items than itemsPerPage at the end
  if (visibleCategories.length < itemsPerPage && categories.length > itemsPerPage) {
    const remaining = itemsPerPage - visibleCategories.length;
    visibleCategories.push(...categories.slice(0, remaining));
  }

  // Get featured products (first 6 products)
  const featuredProducts = products.slice(0, 6);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" component="h1" gutterBottom>
              Welcome to Twana Baby Shop
            </Typography>
            <Typography variant="h5" paragraph>
              Discover the best baby products for your little ones
            </Typography>
            <div>
              <Button
                component={Link}
                to="/shop"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
              >
                Shop Now
              </Button>
              <Button
                component={Link}
                to="/about"
                variant="outlined"
                color="inherit"
                size="large"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Categories Carousel */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          Shop by Category
        </Typography>

        <Box sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          maxWidth: 'calc(100% - 80px)',
          margin: '0 auto',
          px: { xs: 0, md: 4 }
        }}>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: { xs: -12, md: -40 },
              zIndex: 2,
              bgcolor: 'background.paper',
              color: 'primary.main',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
              }
            }}
          >
            <ArrowBackIos fontSize="small" sx={{ ml: 1 }} />
          </IconButton>

          <Grid container spacing={2} justifyContent="center">
            <AnimatePresence mode='wait'>
              {visibleCategories.map((category, index) => (
                <Grid item xs={12} md={4} key={`${category.id}-${index}`}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%' }}
                  >
                    <Link to={`/category/${category.id}`} style={{ textDecoration: 'none' }}>
                      <CategoryCard elevation={3}>
                        <Box
                          className="card-media"
                          sx={{
                            backgroundImage: `url(${category.image || '/images/category-placeholder.jpg'})`,
                          }}
                        >
                          <Box className="card-content">
                            <Typography
                              variant="h5"
                              component="h3"
                              sx={{
                                color: 'white',
                                fontWeight: 600,
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)', // Stronger shadow
                                letterSpacing: '0.5px',
                              }}
                            >
                              {category.name}
                            </Typography>
                          </Box>
                        </Box>
                      </CategoryCard>
                    </Link>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: -20,
              zIndex: 2,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Container>

      {/* ... (Features remains same) */}

      <Box sx={{ bgcolor: 'background.default', py: 10, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
            Why Choose Us
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <LocalShipping fontSize="large" />
                <Typography variant="h6" gutterBottom>Free Shipping</Typography>
                <Typography color="text.secondary">
                  Free delivery on all orders over $50
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <GppGood fontSize="large" />
                <Typography variant="h6" gutterBottom>Safe & Secure</Typography>
                <Typography color="text.secondary">
                  100% secure payment processing
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <Favorite fontSize="large" />
                <Typography variant="h6" gutterBottom>Quality Products</Typography>
                <Typography color="text.secondary">
                  Carefully selected for your little ones
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box >
  );
};

export default Home;
