import { useEffect, useState } from "react";

import api from "../../../services/api";

import PropertyCard from "./PropertyCard";

import "./FeaturedProperties.css";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchFeaturedProperties =
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await api.get(
              "/properties",
              {
                params: {
                  status: "published",
                  isFeatured: true,
                  limit: 6,
                  page: 1,
                },
              }
            );

          setProperties(
            response.data?.properties ||
              response.data?.data ||
              []
          );
        } catch (error) {
          console.error(
            "Featured properties error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Unable to load properties."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="featured-properties">

      <div className="featured-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="featured-heading">

          <div className="featured-heading-text">

            <span className="section-eyebrow">
              GULBERG PROPERTIES
            </span>

            <h2>
              Featured Properties
            </h2>

            <p>
              Discover selected properties
              available in Gulberg Islamabad.
            </p>

          </div>

          <a
            href="/properties"
            className="view-all-properties"
          >
            View All Properties

            <span>
              →
            </span>
          </a>

        </div>

        {/* =================================
            LOADING
        ================================= */}

        {loading && (
          <div className="property-grid">

            {[1, 2, 3].map(
              (item) => (
                <div
                  className="property-skeleton"
                  key={item}
                >

                  <div className="skeleton-image" />

                  <div className="skeleton-content">

                    <div className="skeleton-line" />

                    <div className="skeleton-line short" />

                    <div className="skeleton-line price" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* =================================
            ERROR
        ================================= */}

        {!loading && error && (
          <div className="featured-error">
            {error}
          </div>
        )}

        {/* =================================
            EMPTY
        ================================= */}

        {!loading &&
          !error &&
          properties.length === 0 && (
            <div className="featured-empty">

              <div className="empty-icon">
                G
              </div>

              <h3>
                No featured properties yet
              </h3>

              <p>
                Featured properties will
                appear here once published.
              </p>

            </div>
          )}

        {/* =================================
            PROPERTIES
        ================================= */}

        {!loading &&
          !error &&
          properties.length > 0 && (
            <div className="property-grid">

              {properties.map(
                (property) => (
                  <PropertyCard
                    key={
                      property._id
                    }
                    property={
                      property
                    }
                  />
                )
              )}

            </div>
          )}

      </div>

    </section>
  );
};

export default FeaturedProperties;