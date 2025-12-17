import './Cart.css';

const Cart = () => {
    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <div className="cart-empty">
                <p>Your cart is currently empty.</p>
                <a href="/shop" className="btn btn-primary">Start Shopping</a>
            </div>
        </div>
    );
};

export default Cart;
