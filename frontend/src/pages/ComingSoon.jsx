import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ComingSoon = ({ title }) => {
    return (
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                {title || 'Coming Soon'}
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
                We are working hard to bring you this feature. Stay tuned!
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button component={Link} to="/" variant="contained" size="large">
                    Back to Home
                </Button>
            </Box>
        </Container>
    );
};

export default ComingSoon;
