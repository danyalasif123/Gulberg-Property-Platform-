import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const [scrolled, setScrolled] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <header
      className={`public-navbar ${
        scrolled
          ? "navbar-scrolled"
          : ""
      }`}
    >
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-brand"
        >
          <div className="brand-mark">
            G
          </div>

          <div className="brand-text">
            <span className="brand-name">
              GULBERG
            </span>

            <span className="brand-subtitle">
              PROPERTY PLATFORM
            </span>
          </div>
        </Link>

        <nav className="navbar-links">
<Link
            to="/"
            className="nav-link"
          >
            Home
          </Link>
          <Link
            to="/properties"
            className="nav-link"
          >
            Properties
          </Link>

          <Link
            to="/locations"
            className="nav-link"
          >
            Locations
          </Link>

          <Link
            to="/about"
            className="nav-link"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="nav-link"
          >
            Contact
          </Link>

        </nav>

        <Link
          to="/contact"
          className="navbar-cta"
        >
          Enquire Now
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
        >
          <span />
          <span />
          <span />
        </button>

      </div>

      {mobileMenuOpen && (
        <div className="mobile-navigation mobile-navigation-open">
 <Link
            to="/"
            className="mobile-nav-link"
          >
            Home
          </Link>
          <Link
            to="/properties"
            className="mobile-nav-link"
          >
            Properties
          </Link>

          <Link
            to="/locations"
            className="mobile-nav-link"
          >
            Locations
          </Link>

          <Link
            to="/about"
            className="mobile-nav-link"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="mobile-nav-link"
          >
            Contact
          </Link>

          <Link
            to="/contact"
            className="mobile-nav-cta"
          >
            Enquire Now
          </Link>

        </div>
      )}

    </header>
  );
};

export default Navbar;