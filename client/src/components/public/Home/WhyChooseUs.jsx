import "./WhyChooseUs.css";

const reasons = [
  {
    number: "01",
    title: "Verified Listings",
    description:
      "We focus on genuine property listings to help you make confident decisions.",
  },
  {
    number: "02",
    title: "Local Expertise",
    description:
      "Our platform is focused on Gulberg and its surrounding property market.",
  },
  {
    number: "03",
    title: "Simple Experience",
    description:
      "Search properties, explore locations and get in touch with ease.",
  },
  {
    number: "04",
    title: "Trusted Guidance",
    description:
      "Get professional assistance throughout your property search.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-section">

      <div className="why-choose-container">

        {/* HEADER */}

        <div className="why-choose-header">

          <div className="why-choose-label">
            WHY CHOOSE US
          </div>

          <h2>
            A Better Way to Find
            <span> Your Property</span>
          </h2>

          <p>
            Discover properties with a platform
            designed around the Gulberg property
            market.
          </p>

        </div>

        {/* CONTENT */}

        <div className="why-choose-content">

          <div className="why-choose-intro">

            <div className="why-choose-symbol">
              G
            </div>

            <h3>
              Find the place
              <br />
              <span>that feels right.</span>
            </h3>

            <p>
              Whether you're looking for a home,
              investment opportunity or commercial
              property, we're here to make your
              search easier.
            </p>

          </div>

          <div className="why-choose-grid">

            {reasons.map((reason) => (
              <div
                className="why-choose-card"
                key={reason.number}
              >

                <div className="why-choose-card-top">

                  <span className="why-choose-number">
                    {reason.number}
                  </span>

                  <span className="why-choose-line" />

                </div>

                <h3>
                  {reason.title}
                </h3>

                <p>
                  {reason.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;