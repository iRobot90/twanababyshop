import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../api';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('products/');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="shop-page">Loading...</div>;
    if (error) return <div className="shop-page">{error}</div>;

    return (
        <div className="shop-page">
            <div className="shop-header">
                <h1>Shop All Products</h1>
            </div>
            <div className="products-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;
