import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Welcome to <span className="highlight">TwanaBabyShop</span></h1>
                    <p>The best for your little one, delivered across Kenya.</p>
                    <Link to="/shop">
                        <motion.button
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Shop Now
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            <section className="featured">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Featured Categories
                </motion.h2>
                <div className="categories-grid">
                    {['Clothing', 'Diapers', 'Toys'].map((cat, index) => (
                        <motion.div
                            className="category-card"
                            key={cat}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <h3>{cat}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
