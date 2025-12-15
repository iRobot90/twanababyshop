import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { motion } from 'framer-motion';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAge, setSelectedAge] = useState('All');

    const ageGroups = ['All', '0-6m', '6-12m', '1-2y', '2-4y', '4y+'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('products/');
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedAge === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.age_group === selectedAge));
        }
    }, [selectedAge, products]);

    if (loading) return <div className="shop-page">Loading...</div>;
    if (error) return <div className="shop-page">{error}</div>;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="shop-page">
            <div className="shop-header">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Shop All Products
                </motion.h1>
            </div>

            <div className="filters">
                <span>Filter by Age:</span>
                {ageGroups.map(age => (
                    <button
                        key={age}
                        className={`filter-btn ${selectedAge === age ? 'active' : ''}`}
                        onClick={() => setSelectedAge(age)}
                    >
                        {age}
                    </button>
                ))}
            </div>

            <motion.div
                className="products-grid"
                variants={container}
                initial="hidden"
                animate="show"
                key={selectedAge}
            >
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </motion.div>
        </div>
    );
};

export default Shop;
