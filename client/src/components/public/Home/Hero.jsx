import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../services/api";

import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const [societies, setSocieties] =
    useState([]);

  const [loadingLocations, setLoadingLocations] =
    useState(false);

  const [filters, setFilters] = useState({
    purpose: "sale",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });


  /*
  =========================================
  FETCH SOCIETIES FROM BACKEND
  =========================================
  */

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setLoadingLocations(true);

        const response = await api.get(
          "/locations",
          {
            params: {
              type: "society",
            },
          }
        );

        setSocieties(
          response.data?.locations || []
        );
      } catch (error) {
        console.error(
          "Hero locations error:",
          error
        );

        setSocieties([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchSocieties();
  }, []);


  /*
  =========================================
  HANDLE INPUT CHANGE
  =========================================
  */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /*
  =========================================
  SEARCH
  =========================================
  */

  const handleSearch = (e) => {
    e.preventDefault();

    const params =
      new URLSearchParams();


    /*
     * PURPOSE
     */

    if (filters.purpose) {
      params.set(
        "purpose",
        filters.purpose
      );
    }


    /*
     * PROPERTY TYPE
     */

    if (filters.propertyType) {
      params.set(
        "propertyType",
        filters.propertyType
      );
    }


    /*
     * LOCATION
     *
     * Property.society is currently
     * stored as a STRING.
     *
     * Therefore we send the
     * society NAME.
     */

    if (filters.location) {
      params.set(
        "society",
        filters.location
      );
    }


    /*
     * MIN PRICE
     */

    if (filters.minPrice) {
      params.set(
        "minPrice",
        filters.minPrice
      );
    }


    /*
     * MAX PRICE
     */

    if (filters.maxPrice) {
      params.set(
        "maxPrice",
        filters.maxPrice
      );
    }


    navigate(
      `/properties?${params.toString()}`
    );
  };


  return (
    <section className="hero-section">

      {/* =================================
          BACKGROUND
      ================================= */}

      <div className="hero-background" />

      <div className="hero-overlay" />


      {/* =================================
          CONTENT
      ================================= */}

      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-eyebrow">
            GULBERG ISLAMABAD
          </span>


          <h1>
            Find Your Place
            <span>
              {" "}in Gulberg.
            </span>
          </h1>


          <p className="hero-description">
            Discover residential,
            commercial and investment
            properties in one of
            Islamabad's most sought-after
            communities.
          </p>

        </div>


        {/* =================================
            SEARCH
        ================================= */}

        <form
          className="hero-search"
          onSubmit={handleSearch}
        >


          {/* =================================
              PURPOSE
          ================================= */}

          <div className="search-field">

            <label htmlFor="purpose">
              PURPOSE
            </label>


            <select
              id="purpose"
              name="purpose"
              value={
                filters.purpose
              }
              onChange={
                handleChange
              }
            >

              <option value="sale">
                Buy
              </option>

              <option value="rent">
                Rent
              </option>

            </select>

          </div>


          <div className="search-divider" />


          {/* =================================
              PROPERTY TYPE
          ================================= */}

          <div className="search-field">

            <label htmlFor="propertyType">
              PROPERTY TYPE
            </label>


            <select
              id="propertyType"
              name="propertyType"
              value={
                filters.propertyType
              }
              onChange={
                handleChange
              }
            >

              <option value="">
                All Types
              </option>

              <option value="house">
                House
              </option>

              <option value="apartment">
                Apartment
              </option>

              <option value="plot">
                Plot
              </option>

              <option value="farmhouse">
                Farmhouse
              </option>

              <option value="commercial">
                Commercial
              </option>

            </select>

          </div>


          <div className="search-divider" />


          {/* =================================
              LOCATION
          ================================= */}

          <div className="search-field">

            <label htmlFor="location">
              LOCATION
            </label>


            <select
              id="location"
              name="location"
              value={
                filters.location
              }
              onChange={
                handleChange
              }
              disabled={
                loadingLocations
              }
            >

              <option value="">
                {loadingLocations
                  ? "Loading locations..."
                  : "All Locations"}
              </option>


              {societies.map(
                (society) => (

                  <option
                    key={
                      society._id
                    }
                    value={
                      society.name
                    }
                  >
                    {
                      society.name
                    }
                  </option>

                )
              )}

            </select>

          </div>


          <div className="search-divider" />


          {/* =================================
              PRICE
          ================================= */}

          <div className="search-price">

            <label>
              PRICE
            </label>


            <div className="price-inputs">

              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={
                  filters.minPrice
                }
                onChange={
                  handleChange
                }
              />


              <span>
                —
              </span>


              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={
                  filters.maxPrice
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>


          {/* =================================
              SEARCH BUTTON
          ================================= */}

          <button
            type="submit"
            className="hero-search-button"
          >
            Search
          </button>

        </form>


        {/* =================================
            SCROLL
        ================================= */}

        <button
          type="button"
          className="hero-scroll"
          onClick={() => {
            window.scrollTo({
              top:
                window.innerHeight,
              behavior: "smooth",
            });
          }}
        >

          <span>
            Explore Properties
          </span>


          <span className="scroll-arrow">
            ↓
          </span>

        </button>

      </div>

    </section>
  );
};

export default Hero;