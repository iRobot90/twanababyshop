import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box, Skeleton, Chip, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import api from '../api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();

    const categoryFilter = searchParams.get('category');
    const [selectedAge, setSelectedAge] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const ageGroups = ['All', '0-6m', '6-12m', '1-2y', '2-4y', '4y+'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'products/';
                const params = new URLSearchParams();

                if (categoryFilter) {
                    params.append('category__slug', categoryFilter);
                }

                if (selectedAge !== 'All') {
                    params.append('age_group', selectedAge);
                }

                if (searchTerm) {
                    params.append('search', searchTerm);
                }

                const response = await api.get(url, { params });
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [categoryFilter, selectedAge, searchTerm]);

    const handleAgeFilter = (age) => {
        setSelectedAge(age);
    };

    const clearFilters = () => {
        setSearchParams({});
        setSelectedAge('All');
        setSearchTerm('');
    };

    if (loading && !products.length) { // Only show full skeleton on initial load
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Skeleton variant="text" width="40%" height={60} sx={{ mb: 4 }} />
                <Grid container spacing={4}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                            <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    Try Again
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        mb: 2
                    }}
                >
                    {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` : 'Our Products'}
                </Typography>

                {/* Search Bar */}
                <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Filters */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ width: '100%', mb: 1 }}>Filter by Age:</Typography>
                    {ageGroups.map((age) => (
                        <Chip
                            key={age}
                            label={age}
                            onClick={() => handleAgeFilter(age)}
                            color={selectedAge === age ? "primary" : "default"}
                            variant={selectedAge === age ? "filled" : "outlined"}
                            clickable
                        />
                    ))}
                    {(categoryFilter || selectedAge !== 'All' || searchTerm) && (
                        <Button onClick={clearFilters} color="secondary" size="small" sx={{ ml: 2 }}>
                            Clear Filters
                        </Button>
                    )}
                </Box>
            </Box>

            {products.length > 0 ? (
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <ProductCard
                                product={product}
                                onAddToCart={addToCart}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box textAlign="center" py={6}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No products found matching your criteria.
                    </Typography>
                    <Button
                        onClick={clearFilters}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Clear Filters
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Shop;
