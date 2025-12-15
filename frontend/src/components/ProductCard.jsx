import { motion } from 'framer-motion';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            className="product-card"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="product-image">
                <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <span className="age-badge">{product.age_group}</span>
                <p className="product-price">KES {product.price}</p>
                <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
