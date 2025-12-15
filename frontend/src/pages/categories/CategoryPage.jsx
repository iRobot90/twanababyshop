import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Shop from '../Shop';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Redirect to Shop page with category query param
  useEffect(() => {
    navigate(`/shop?category=${categoryId}`, { replace: true });
  }, [categoryId, navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      Loading...
    </Container>
  );
};

export default CategoryPage;
