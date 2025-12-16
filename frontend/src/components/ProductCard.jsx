import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    IconButton,
    Tooltip,
    Rating,
    styled
} from '@mui/material';
import { AddShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const ProductImage = styled(CardMedia)({
    paddingTop: '100%',
    position: 'relative',
    '&:hover .quick-view': {
        opacity: 1,
        transform: 'translateY(0)',
    },
});

const QuickViewButton = styled(Button)({
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    opacity: 0,
    transition: 'all 0.3s ease',
    minWidth: '140px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
    '&:hover': {
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
});

const WishlistButton = styled(IconButton)({
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
        backgroundColor: '#fff',
    },
});

const ProductCard = ({ product, onAddToCart }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <StyledCard
            elevation={2}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardActionArea
                component={Link}
                to={`/product/${product.slug}`}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                }}
            >
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <ProductImage
                        component="div"
                        sx={{
                            backgroundImage: `url(${product.image || '/images/category-placeholder.jpg'})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: '#f9f9f9',
                            borderRadius: 1,
                            mb: 2,
                        }}
                    >
                        {!product.inStock && (
                            <Chip
                                label="Out of Stock"
                                color="error"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    left: 10,
                                    fontWeight: 'bold',
                                }}
                            />
                        )}

                        <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
                            <WishlistButton
                                size="small"
                                onClick={toggleWishlist}
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                {isWishlisted ? (
                                    <Favorite color="error" />
                                ) : (
                                    <FavoriteBorder />
                                )}
                            </WishlistButton>
                        </Tooltip>

                        {isHovered && (
                            <QuickViewButton
                                variant="contained"
                                color="primary"
                                className="quick-view"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Navigate to product detail
                                    window.location.href = `/product/${product.slug}`;
                                }}
                            >
                                Quick View
                            </QuickViewButton>
                        )}
                    </ProductImage>
                </Box>

                <CardContent sx={{ width: '100%', p: 0, flexGrow: 1 }}>
                    <Box sx={{ mb: 1 }}>
                        <Rating
                            value={4.5}
                            precision={0.5}
                            size="small"
                            readOnly
                            sx={{ mb: 0.5 }}
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '2.8em',
                                mb: 1,
                            }}
                        >
                            {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography
                                variant="h6"
                                color="primary"
                                sx={{ fontWeight: 700 }}
                            >
                                ${Number(product.price).toFixed(2)}
                            </Typography>
                            {product.originalPrice && (
                                <Typography
                                    variant="body2"
                                    color="text.disabled"
                                    sx={{
                                        textDecoration: 'line-through',
                                        ml: 1,
                                    }}
                                >
                                    ${Number(product.originalPrice).toFixed(2)}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddShoppingCart />}
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        sx={{
                            mt: 'auto',
                            '&.Mui-disabled': {
                                backgroundColor: 'action.disabledBackground',
                                color: 'text.disabled',
                            },
                        }}
                    >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </CardContent>
            </CardActionArea>
        </StyledCard>
    );
};

export default ProductCard;
