import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to <span className="highlight">TwanaBabyShop</span></h1>
                    <p>The best for your little one, delivered across Kenya.</p>
                    <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                </div>
            </section>

            <section className="featured">
                <h2>Featured Categories</h2>
                <div className="categories-grid">
                    <div className="category-card">
                        <h3>Clothing</h3>
                    </div>
                    <div className="category-card">
                        <h3>Diapers</h3>
                    </div>
                    <div className="category-card">
                        <h3>Toys</h3>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
