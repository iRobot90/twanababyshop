import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>TwanaBabyShop</h3>
                    <p>Your one-stop shop for all baby needs in Kenya.</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/shop">Shop</a></li>
                        <li><a href="/cart">Cart</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Nairobi, Kenya</p>
                    <p>Phone: +254 700 000 000</p>
                    <p>Email: info@twanababyshop.co.ke</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 TwanaBabyShop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
