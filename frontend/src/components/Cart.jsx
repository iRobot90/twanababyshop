import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Button } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart } = useCart();

  return (
    <Drawer anchor="right" open={isCartOpen} onClose={closeCart}>
      <Box sx={{ width: 350, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={closeCart}>
            <Close />
          </IconButton>
        </Box>

        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {cartItems.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              Your cart is empty.
            </Typography>
          ) : (
            cartItems.map(item => (
              <ListItem key={item.id} secondaryAction={
                <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                  <Delete />
                </IconButton>
              }>
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price} x ${item.quantity}`}
                />
              </ListItem>
            ))
          )}
        </List>

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </Typography>
          <Button variant="contained" fullWidth size="large" onClick={() => { closeCart(); window.location.href = '/checkout'; }}>
            Checkout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Cart;
