import { Container, Typography, Grid, Paper, Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { categories } from '../../data/products';

const CategoryCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  '& .card-media': {
    height: 250,
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
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

const CategoriesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 6 }}>
        All Categories
      </Typography>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Link to={`/category/${category.id}`} style={{ textDecoration: 'none' }}>
              <CategoryCard elevation={3}>
                <Box
                  className="card-media"
                  sx={{
                    backgroundImage: `url(${category.image})`,
                  }}
                >
                  <Box className="card-content">
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </Box>
              </CategoryCard>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesPage;
