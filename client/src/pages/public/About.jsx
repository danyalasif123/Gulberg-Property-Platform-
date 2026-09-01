import Navbar from "../../components/public/Home/Navbar";
import Footer from "../../components/public/Home/Footer";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      <main>
        {/* =========================================
            ABOUT HERO
        ========================================= */}
        <section className="about-hero">
          <div className="about-hero-overlay"></div>

          <div className="about-hero-container">
            <span className="about-eyebrow">
              ABOUT US
            </span>

            <h1>
              Your Trusted
              <span>Property Partner</span>
            </h1>

            <p>
              Connecting people with exceptional properties
              and opportunities in Gulberg, Islamabad.
            </p>
          </div>
        </section>

        {/* =========================================
            INTRODUCTION
        ========================================= */}
        <section className="about-intro">
          <div className="about-container">

            <div className="about-intro-content">
              <span className="section-eyebrow">
                WHO WE ARE
              </span>

              <h2>
                Property Search,
                <span>Made Simple.</span>
              </h2>

              <p>
                Gulberg Property Platform is a modern real estate
                platform created to make discovering, buying,
                selling, and exploring properties in Gulberg
                easier and more transparent.
              </p>

              <p>
                We bring properties, locations, and opportunities
                together in one place, helping buyers, sellers,
                and investors make confident property decisions.
              </p>
            </div>

            <div className="about-intro-card">
              <div className="about-card-mark">
                G
              </div>

              <span>GULBERG</span>

              <strong>
                PROPERTY
                <br />
                PLATFORM
              </strong>

              <small>
                ISLAMABAD · PAKISTAN
              </small>
            </div>

          </div>
        </section>

        {/* =========================================
            MISSION / VISION
        ========================================= */}
        <section className="about-values">
          <div className="about-container">

            <div className="about-section-heading">
              <span className="section-eyebrow">
                WHAT DRIVES US
              </span>

              <h2>
                Built Around
                <span>Your Needs</span>
              </h2>
            </div>

            <div className="values-grid">

              <article className="value-card">
                <span className="value-number">
                  01
                </span>

                <div className="value-icon">
                  ◈
                </div>

                <h3>
                  Our Mission
                </h3>

                <p>
                  To simplify the property journey by providing
                  reliable listings, useful information, and a
                  seamless experience for everyone looking for
                  property in Gulberg.
                </p>
              </article>

              <article className="value-card">
                <span className="value-number">
                  02
                </span>

                <div className="value-icon">
                  ◇
                </div>

                <h3>
                  Our Vision
                </h3>

                <p>
                  To become a trusted digital destination for
                  real estate in Islamabad, connecting people
                  with the right properties and opportunities.
                </p>
              </article>

              <article className="value-card">
                <span className="value-number">
                  03
                </span>

                <div className="value-icon">
                  ✦
                </div>

                <h3>
                  Our Promise
                </h3>

                <p>
                  We focus on clarity, convenience, and a
                  professional property experience so you can
                  explore your next move with confidence.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* =========================================
            WHY US
        ========================================= */}
        <section className="about-why">
          <div className="about-container">

            <div className="about-why-image">
              <div className="why-image-overlay"></div>

              <div className="why-image-content">
                <span>
                  GULBERG
                </span>

                <strong>
                  A BETTER
                  <br />
                  WAY TO
                  <br />
                  FIND HOME
                </strong>
              </div>
            </div>

            <div className="about-why-content">
              <span className="section-eyebrow">
                WHY GULBERG PROPERTY PLATFORM
              </span>

              <h2>
                Everything You Need,
                <span>In One Place.</span>
              </h2>

              <p>
                Searching for property should not be complicated.
                Our platform is designed to give you a cleaner,
                easier way to explore properties and discover
                opportunities across Gulberg.
              </p>

              <div className="why-list">

                <div className="why-item">
                  <span>01</span>

                  <div>
                    <h3>
                      Curated Properties
                    </h3>

                    <p>
                      Explore properties organized to make your
                      search faster and easier.
                    </p>
                  </div>
                </div>

                <div className="why-item">
                  <span>02</span>

                  <div>
                    <h3>
                      Local Focus
                    </h3>

                    <p>
                      Built specifically around the property
                      market and communities of Gulberg.
                    </p>
                  </div>
                </div>

                <div className="why-item">
                  <span>03</span>

                  <div>
                    <h3>
                      Simple Experience
                    </h3>

                    <p>
                      Find information, compare options, and
                      connect with confidence.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}
        <section className="about-cta">
          <div className="about-cta-overlay"></div>

          <div className="about-cta-content">
            <span className="section-eyebrow">
              YOUR NEXT MOVE
            </span>

            <h2>
              Ready to Find
              <span>Your Property?</span>
            </h2>

            <p>
              Explore our latest properties and discover
              opportunities in Gulberg, Islamabad.
            </p>

            <a
              href="/properties"
              className="about-cta-button"
            >
              EXPLORE PROPERTIES
              <span>→</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;