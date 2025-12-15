import { useState } from 'react';
import { Container, Typography, Grid, Paper, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Divider } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Checkout = () => {
    const { cartItems, cartCount } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                postal_code: formData.postalCode,
                cart_items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                }))
            };

            await api.post('orders/', orderData);
            alert('Order placed successfully!');
            // Clear cart logic should be here, but for now we just redirect
            // Ideally, useCart should expose a clearCart function
            navigate('/');
            window.location.reload(); // Temporary way to clear cart by reloading (if not persisted)
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartCount === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Your cart is empty</Typography>
                <Button variant="contained" onClick={() => navigate('/shop')}>Go to Shop</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
                Checkout
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>Shipping Information</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleInputChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth label="Address" name="address" value={formData.address} onChange={handleInputChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth label="Phone (for M-Pesa)" name="phone" value={formData.phone} onChange={handleInputChange} />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h5" gutterBottom>Payment Method</Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
                                        <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                                        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                                        <FormControlLabel value="mpesa" control={<Radio />} label="M-Pesa" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 4 }}>
                                Place Order
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 4, bgcolor: 'grey.50' }}>
                        <Typography variant="h5" gutterBottom>Order Summary</Typography>
                        <Box sx={{ my: 2 }}>
                            {cartItems.map(item => (
                                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>{item.name} x {item.quantity}</Typography>
                                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Checkout;
