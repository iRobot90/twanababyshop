import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Something went wrong.
                    </Typography>
                    <Box sx={{ my: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'left', overflow: 'auto' }}>
                        <Typography variant="body1" component="pre" sx={{ fontFamily: 'monospace', color: 'error.main' }}>
                            {this.state.error && this.state.error.toString()}
                        </Typography>
                        <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', mt: 2 }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </Button>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
