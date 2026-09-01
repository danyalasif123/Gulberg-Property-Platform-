import Navbar from "../../components/public/Home/Navbar";
import Footer from "../../components/public/Home/Footer";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      <main>
        {/* ================================
            CONTACT HERO
        ================================= */}
        <section className="contact-hero">
          <div className="contact-hero-overlay"></div>

          <div className="contact-hero-container">
            <span className="contact-eyebrow">
              GET IN TOUCH
            </span>

            <h1>
              Let&apos;s Talk About
              <span>Your Property</span>
            </h1>

            <p>
              Whether you&apos;re looking to buy, sell, or explore
              property opportunities in Gulberg, our team is here
              to help.
            </p>
          </div>
        </section>

        {/* ================================
            CONTACT SECTION
        ================================= */}
        <section className="contact-section">
          <div className="contact-container">

            {/* LEFT — INFORMATION */}
            <div className="contact-info">
              <span className="section-eyebrow">
                CONTACT US
              </span>

              <h2>
                We&apos;re Here
                <span>To Help</span>
              </h2>

              <p className="contact-intro">
                Have a question about a property or want to
                discuss your next investment? Get in touch with
                Gulberg Property Platform and our team will be
                happy to assist you.
              </p>

              <div className="contact-details">

                <div className="contact-detail">
                  <div className="contact-icon">
                    ✉
                  </div>

                  <div>
                    <span>Email</span>
                    <a href="mailto:info@gulbergproperty.com">
                      info@gulbergproperty.com
                    </a>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-icon">
                    ☎
                  </div>

                  <div>
                    <span>Phone</span>
                    <a href="tel:+92511111111">
                      +92 51 111 111 111
                    </a>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-icon">
                    ◉
                  </div>

                  <div>
                    <span>Location</span>
                    <p>
                      Gulberg Greens, Islamabad, Pakistan
                    </p>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-icon">
                    ◷
                  </div>

                  <div>
                    <span>Office Hours</span>
                    <p>
                      Monday — Saturday
                      <br />
                      9:00 AM — 6:00 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT — FORM */}
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <span>ENQUIRE NOW</span>

                <h2>
                  Send Us a Message
                </h2>
              </div>

              <form className="contact-form">

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      FULL NAME
                    </label>

                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      EMAIL ADDRESS
                    </label>

                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      PHONE NUMBER
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      SUBJECT
                    </label>

                    <select id="subject" defaultValue="">
                      <option value="" disabled>
                        Select subject
                      </option>
                      <option value="buy">
                        I want to buy
                      </option>
                      <option value="sell">
                        I want to sell
                      </option>
                      <option value="rent">
                        I want to rent
                      </option>
                      <option value="general">
                        General enquiry
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    YOUR MESSAGE
                  </label>

                  <textarea
                    id="message"
                    rows="6"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                >
                  SEND MESSAGE
                  <span>→</span>
                </button>

              </form>
            </div>

          </div>
        </section>

        {/* ================================
            MAP / LOCATION
        ================================= */}
        <section className="contact-location">
          <div className="location-container">

            <div className="location-content">
              <span className="section-eyebrow">
                FIND US
              </span>

              <h2>
                Visit Our
                <span>Office</span>
              </h2>

              <p>
                Located in the heart of Gulberg Greens,
                Islamabad, our office is ready to welcome you.
              </p>

              <div className="location-address">
                <strong>Gulberg Property Platform</strong>
                <span>
                  Gulberg Greens, Islamabad
                </span>
                <span>
                  Islamabad Capital Territory, Pakistan
                </span>
              </div>
            </div>

            <div className="location-map">
              <div className="map-placeholder">
                <div className="map-pin">
                  ◉
                </div>

                <span>
                  GULBERG GREENS
                </span>

                <small>
                  ISLAMABAD, PAKISTAN
                </small>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;