import "./Footer.css";

const Footer = () => {
  return (
    <footer className="public-footer">

      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-brand-mark">
            G
          </div>

          <div>
            <div className="footer-brand-name">
              GULBERG PROPERTY
            </div>

            <div className="footer-brand-subtitle">
              FIND YOUR PLACE
            </div>
          </div>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a href="/contact">Contact</a>
        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} Gulberg Property.
          All rights reserved.
        </span>

        <span>
          Gulberg, Islamabad
        </span>

      </div>

    </footer>
  );
};

export default Footer;