import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { CartProvider } from './contexts/CartContext';
import theme from './theme';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoriesPage from './pages/categories/CategoriesPage';
import CategoryPage from './pages/categories/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Checkout from './pages/Checkout';
import ComingSoon from './pages/ComingSoon';
import { GlobalStyles } from '@mui/material';

// Global styles
const globalStyles = {
  'html, body, #root': {
    height: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  body: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    lineHeight: 1.6,
    fontFamily: theme.typography.fontFamily,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.2,
  },
  'p': {
    margin: 0,
  },
  'a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  'img': {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <CartProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: { xs: 2, md: 4 },
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Footer Links - Coming Soon */}
                <Route path="/new-arrivals" element={<ComingSoon title="New Arrivals" />} />
                <Route path="/best-sellers" element={<ComingSoon title="Best Sellers" />} />
                <Route path="/sale" element={<ComingSoon title="On Sale" />} />
                <Route path="/gift-cards" element={<ComingSoon title="Gift Cards" />} />
                <Route path="/lookbook" element={<ComingSoon title="Lookbook" />} />
                <Route path="/privacy" element={<ComingSoon title="Privacy Policy" />} />
                <Route path="/terms" element={<ComingSoon title="Terms of Service" />} />
                <Route path="/shipping" element={<ComingSoon title="Shipping & Returns" />} />
              </Routes>
            </Box>
            <Cart />
            <Footer />
          </Box>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
