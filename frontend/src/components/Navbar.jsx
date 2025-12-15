import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Navbar.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Slide,
  useScrollTrigger,
  Fade,
  InputBase,
  Avatar,
  Tooltip,
  Chip,
  Grid,
  Stack
} from '@mui/material';
import {
  ShoppingCartOutlined as CartIcon,
  PersonOutline as UserIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Category as CategoryIcon,
  Home as HomeIcon,
  Store as ShopIcon,
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

// ============================================
// Styled Components
// ============================================
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&.scrolled': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none',
  '&:hover': {
    opacity: 0.9,
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  textTransform: 'none',
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      height: 3,
      backgroundColor: theme.palette.primary.main,
      borderRadius: '3px 3px 0 0',
    }
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 8,
    padding: '0 4px',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontSize: '0.65rem',
    fontWeight: 'bold',
    height: 18,
    minWidth: 18,
    borderRadius: 9,
  },
}));

// Trust Badge Component
const TrustBadge = ({ icon: Icon, label, color = 'primary' }) => (
  <Chip
    icon={<Icon fontSize="small" />}
    label={label}
    size="small"
    variant="outlined"
    sx={{
      borderColor: `${color}.main`,
      color: `${color}.dark`,
      bgcolor: `${color}.light`,
      '& .MuiChip-icon': { color: `${color}.dark` },
      height: 26,
      fontSize: '0.7rem',
      fontWeight: 500,
      borderRadius: 1,
    }}
  />
);

// Search Component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.action.hover, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.15),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { cartCount, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesMenuAnchor, setCategoriesMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const appBarRef = useRef(null);
  const searchRef = useRef(null);

  const ageGroups = [
    { id: 'newborn', label: 'Newborn (0-3m)' },
    { id: 'infant', label: 'Infant (3-12m)' },
    { id: 'toddler', label: 'Toddler (1-3y)' },
    { id: 'preschool', label: 'Preschool (3-5y)' },
  ];

  const categories = [
    { name: 'Clothing', path: '/category/clothing', icon: <CategoryIcon fontSize="small" /> },
    { name: 'Toys', path: '/category/toys', icon: <CategoryIcon fontSize="small" /> },
    { name: 'Nursery', path: '/category/nursery', icon: <CategoryIcon fontSize="small" /> },
    { name: 'Feeding', path: '/category/feeding', icon: <CategoryIcon fontSize="small" /> },
    { name: 'Bath & Care', path: '/category/bath-care', icon: <CategoryIcon fontSize="small" /> },
  ];

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Shop', path: '/shop', icon: <ShopIcon /> },
    {
      name: 'Categories',
      path: '/categories',
      icon: <CategoryIcon />,
      subItems: categories
    },
  ];

  const handleScroll = () => {
    const isScrolled = window.scrollY > 10;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleCategoriesMenuOpen = (event) => {
    setCategoriesMenuAnchor(event.currentTarget);
  };

  const handleCategoriesMenuClose = () => {
    setCategoriesMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    handleCategoriesMenuClose();
  };

  const isActive = (path, exact = false) => {
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path) && path !== '/';
  };


  return (
    <>
      <Slide appear={false} direction="down" in={!scrolled}>
        <StyledAppBar position="sticky" ref={appBarRef} className={scrolled ? 'scrolled' : ''}>
          {/* Top Trust Bar */}
          <Box
            sx={{
              bgcolor: 'primary.dark',
              color: 'primary.contrastText',
              py: 0.5,
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Container maxWidth="xl">
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 0.5 }}
              >
                <Stack direction="row" spacing={2}>
                  <TrustBadge
                    icon={ShippingIcon}
                    label="Free Delivery on Orders Over KES 5,000"
                    color="secondary"
                  />
                  <TrustBadge
                    icon={SecurityIcon}
                    label="Secure Checkout"
                    color="success"
                  />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">+254 700 000000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WhatsAppIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">+254 700 000000</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Container>
          </Box>

          {/* Main Navigation */}
          <Container maxWidth="xl" sx={{ py: 1 }}>
            <Toolbar disableGutters>
              {/* Mobile Menu Button */}
              <Box sx={{ display: { xs: 'flex', lg: 'none' }, mr: 1 }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  color="inherit"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </Box>

              {/* Logo */}
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  mr: { xs: 'auto', lg: 4 }
                }}
              >
                <LogoText>Twanababy</LogoText>
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, ml: 2 }}>
                {navItems.map((item) => (
                  <Box key={item.name} sx={{ position: 'relative' }}>
                    <NavButton
                      onClick={() => item.subItems ? null : handleNavClick(item.path)}
                      onMouseOver={item.subItems ? handleCategoriesMenuOpen : undefined}
                      className={isActive(item.path) ? 'active' : ''}
                      endIcon={item.subItems ? <ExpandMoreIcon /> : null}
                    >
                      {item.name}
                    </NavButton>
                  </Box>
                ))}
              </Box>

              {/* Search Bar */}
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
                {searchOpen || !isMobile ? (
                  <Search ref={searchRef}>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <form onSubmit={handleSearchSubmit}>
                      <StyledInputBase
                        placeholder="Search products..."
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      />
                    </form>
                    {isMobile && (
                      <IconButton onClick={handleSearchToggle} sx={{ ml: 1 }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Search>
                ) : (
                  <IconButton onClick={handleSearchToggle}>
                    <SearchIcon />
                  </IconButton>
                )}
              </Box>

              {/* Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, lg: 2 } }}>
                <Tooltip title="Wishlist">
                  <IconButton color="inherit" sx={{ mr: 1 }}>
                    <FavoriteBorderIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cart">
                  <IconButton color="inherit" onClick={openCart} sx={{ mr: 1 }}>
                    <StyledBadge badgeContent={cartCount} color="secondary">
                      <CartIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Account">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    color="inherit"
                    sx={{ p: 0.5, ml: 0.5 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <UserIcon fontSize="small" />
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>

          {/* Categories Mega Menu */}
          <Menu
            anchorEl={categoriesMenuAnchor}
            open={Boolean(categoriesMenuAnchor)}
            onClose={handleCategoriesMenuClose}
            MenuListProps={{ onMouseLeave: handleCategoriesMenuClose }}
            PaperProps={{
              elevation: 4,
              sx: {
                width: '100%',
                maxWidth: '100%',
                left: '0 !important',
                right: 0,
                mt: 0.5,
                p: 3,
                borderTop: `2px solid ${theme.palette.primary.main}`,
              },
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={4}>
                <Grid item xs={12} md={9}>
                  <Typography variant="h6" gutterBottom>Shop by Category</Typography>
                  <Grid container spacing={2}>
                    {categories.map((category) => (
                      <Grid item xs={6} sm={4} md={3} key={category.name}>
                        <Button
                          component={RouterLink}
                          to={category.path}
                          startIcon={category.icon}
                          onClick={handleCategoriesMenuClose}
                          fullWidth
                          sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            color: 'text.primary',
                            '&:hover': {
                              color: 'primary.main',
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          {category.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="h6" gutterBottom>Shop by Age</Typography>
                  <Stack spacing={1}>
                    {ageGroups.map((ageGroup) => (
                      <Button
                        key={ageGroup.id}
                        component={RouterLink}
                        to={`/shop?age=${ageGroup.id}`}
                        onClick={handleCategoriesMenuClose}
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        {ageGroup.label}
                      </Button>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Container>
          </Menu>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleNavClick('/account')}>
              <ListItemIcon>
                <UserIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Account</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavClick('/orders')}>
              <ListItemIcon>
                <CartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Orders</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavClick('/wishlist')}>
              <ListItemIcon>
                <FavoriteBorderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Wishlist</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavClick('/login')}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Login / Register</ListItemText>
            </MenuItem>
          </Menu>
        </StyledAppBar>
      </Slide>

      {/* Mobile Menu */}
      <Fade in={mobileMenuOpen}>
        <Box
          sx={{
            position: 'fixed',
            top: scrolled ? 68 : 88,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.paper',
            zIndex: 1199,
            overflowY: 'auto',
            display: { xs: 'block', lg: 'none' },
            boxShadow: 3,
          }}
        >
          <Box sx={{ p: 2 }}>
            {navItems.map((item) => (
              <Box key={item.name} mb={1}>
                <Button
                  fullWidth
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                >
                  {item.name}
                </Button>
                {item.subItems && (
                  <Box sx={{ pl: 3, mt: 1, mb: 2 }}>
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.name}
                        fullWidth
                        component={RouterLink}
                        to={subItem.path}
                        startIcon={subItem.icon}
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1,
                          color: isActive(subItem.path) ? 'primary.main' : 'text.secondary',
                          fontSize: '0.9rem',
                        }}
                      >
                        {subItem.name}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2, mb: 1, fontWeight: 600 }}>
              Shop by Age
            </Typography>
            <Stack spacing={1} sx={{ px: 1 }}>
              {ageGroups.map((ageGroup) => (
                <Button
                  key={ageGroup.id}
                  component={RouterLink}
                  to={`/shop?age=${ageGroup.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5,
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                  }}
                >
                  {ageGroup.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default Navbar;
