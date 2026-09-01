import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/public/Home/Navbar";
import Footer from "../../components/public/Home/Footer";

import api from "../../services/api";

import "./Locations.css";

const Locations = () => {
  const [societies, setSocieties] = useState([]);
  const [blocks, setBlocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/locations", {
          params: {
            type: "society",
          },
        });

        const societyList =
          response.data?.locations || [];

        setSocieties(societyList);

        const blockResults =
          await Promise.all(
            societyList.map(async (society) => {
              try {
                const blockResponse =
                  await api.get("/locations", {
                    params: {
                      type: "block",
                      parentLocation: society._id,
                    },
                  });

                return {
                  societyId: society._id,
                  blocks:
                    blockResponse.data?.locations || [],
                };
              } catch (error) {
                console.error(
                  `Failed to load blocks for ${society.name}:`,
                  error
                );

                return {
                  societyId: society._id,
                  blocks: [],
                };
              }
            })
          );

        const blockMap = {};

        blockResults.forEach((item) => {
          blockMap[item.societyId] = item.blocks;
        });

        setBlocks(blockMap);
      } catch (error) {
        console.error(
          "Fetch locations error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load locations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const getImage = (location) => {
    if (!location?.image) {
      return "";
    }

    if (typeof location.image === "string") {
      return location.image;
    }

    return (
      location.image.url ||
      location.image.secure_url ||
      location.image.src ||
      ""
    );
  };

  return (
    <div className="public-locations-page">
      <Navbar />

      <main>

        {/* =================================
            HERO
        ================================= */}

        <section className="locations-hero">

          <div className="locations-container">

            <span className="locations-eyebrow">
              EXPLORE GULBERG
            </span>

            <h1>
              Find Properties
             <span>
                  {" "}by Location
                </span>
            </h1>

            <p>
              Explore societies and blocks
              across Gulberg and discover
              properties in the areas that
              interest you.
            </p>

          </div>

        </section>


        {/* =================================
            LOCATIONS
        ================================= */}

        <section className="locations-section">

          <div className="locations-container">

            <div className="locations-heading">

              <div>

                <span className="locations-label">
                  LOCATIONS
                </span>

                <h2>
                  Explore Gulberg
                </h2>

              </div>

              <p>
                Browse properties by society
                and block.
              </p>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (
              <div className="locations-error">
                {error}
              </div>
            )}


            {/* =================================
                LOADING
            ================================= */}

            {loading ? (

              <div className="locations-loading">

                <div className="locations-spinner" />

                <p>
                  Loading locations...
                </p>

              </div>

            ) : societies.length === 0 ? (

              <div className="locations-empty">

                <h3>
                  No locations available
                </h3>

                <p>
                  There are currently no
                  locations to explore.
                </p>

              </div>

            ) : (

              <div className="locations-list">

                {societies.map((society) => {

                  const societyBlocks =
                    blocks[society._id] || [];

                  const image =
                    getImage(society);

                  return (
                    <article
                      key={society._id}
                      className="location-society"
                    >

                      {/* =================================
                          SOCIETY
                      ================================= */}

                      <div className="location-society-header">

                        <div className="location-society-image">

                          {image ? (

                            <img
                              src={image}
                              alt={society.name}
                            />

                          ) : (

                            <div className="location-image-placeholder">
                              G
                            </div>

                          )}

                        </div>


                        <div className="location-society-info">

                          <span className="location-type">
                            SOCIETY
                          </span>

                          <h3>
                            {society.name}
                          </h3>

                          {society.description && (
                            <p>
                              {society.description}
                            </p>
                          )}

                        </div>


                        <Link
                          to={`/properties?society=${encodeURIComponent(
                            society.name
                          )}`}
                          className="location-view-button"
                        >
                          View Properties
                          <span>
                            →
                          </span>
                        </Link>

                      </div>


                      {/* =================================
                          BLOCKS
                      ================================= */}

                      <div className="location-blocks">

                        <div className="location-blocks-heading">

                          <span>
                            BLOCKS
                          </span>

                          <small>
                            {societyBlocks.length}{" "}
                            {societyBlocks.length === 1
                              ? "block"
                              : "blocks"}
                          </small>

                        </div>


                        {societyBlocks.length === 0 ? (

                          <div className="location-no-blocks">
                            No blocks available
                          </div>

                        ) : (

                          <div className="location-block-grid">

                            {societyBlocks.map(
                              (block) => (

                                <Link
                                  key={
                                    block._id
                                  }
                                  to={`/properties?society=${encodeURIComponent(
                                    society.name
                                  )}&block=${encodeURIComponent(
                                    block.name
                                  )}`}
                                  className="location-block-card"
                                >

                                  <div>

                                    <span className="block-label">
                                      BLOCK
                                    </span>

                                    <h4>
                                      {block.name}
                                    </h4>

                                  </div>

                                  <span className="block-arrow">
                                    →
                                  </span>

                                </Link>

                              )
                            )}

                          </div>

                        )}

                      </div>

                    </article>
                  );
                })}

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Locations;