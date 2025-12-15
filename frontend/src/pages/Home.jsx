import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Welcome to <span className="highlight">TwanaBabyShop</span></h1>
                    <p>The best for your little one, delivered across Kenya.</p>
                    <Link to="/shop">
                        <motion.button
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Shop Now
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            <section className="featured">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Featured Categories
                </motion.h2>
                <div className="categories-grid">
                    {['Clothing', 'Diapers', 'Toys'].map((cat, index) => (
                        <motion.div
                            className="category-card"
                            key={cat}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <h3>{cat}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
=======
import { Box, Container, Typography, Button, Grid, Paper, styled, IconButton } from '@mui/material';
import { ShoppingCart, LocalShipping, GppGood, Favorite, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { categories } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" component="h1">
              Welcome to TwanaBabyShop
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 300 }}>
              Premium Baby Products for Your Little Ones
            </Typography>
            <Box>
              <Button
                component={Link}
                to="/shop"
                variant="contained"
                color="primary"
                size="large"
              >
                Shop Now
              </Button>
              <Button
                component={Link}
                to="/categories"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                View Categories
              </Button>
            </Box>
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
>>>>>>> 88e8ed9 (Major backend and frontend updates for product management)
};

export default Home;
