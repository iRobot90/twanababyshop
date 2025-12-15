import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">KES {product.price}</p>
                <button className="btn btn-primary">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;
