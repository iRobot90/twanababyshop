import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    return (
        <motion.nav
            className="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
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
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <FaShoppingCart />
                        </motion.div>
                        <span className="cart-count">0</span>
                    </Link>
                    <Link to="/profile" className="user-icon">
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <FaUser />
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
