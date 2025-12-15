import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Twana<span className="highlight">BabyShop</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                </div>
                <div className="navbar-icons">
                    <Link to="/cart" className="cart-icon">
                        <FaShoppingCart />
                        <span className="cart-count">0</span>
                    </Link>
                    <Link to="/profile" className="user-icon">
                        <FaUser />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
