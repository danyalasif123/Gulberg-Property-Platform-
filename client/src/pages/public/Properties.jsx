import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/public/Home/Navbar";
import Footer from "../../components/public/Home/Footer";

import PropertyListCard from "../../components/public/properties/PropertyListCard";
import PropertyFilters from "../../components/public/properties/PropertyFilters";
import PropertyPagination from "../../components/public/properties/PropertyPagination";

import api from "../../services/api";

import "./Properties.css";

const Properties = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [pagination, setPagination] =
    useState({
      total: 0,
      totalPages: 1,
      page: 1,
      limit: 12,
    });


  /*
  =========================================
  READ FILTERS FROM URL
  =========================================
  */

  const filters = {
    search:
      searchParams.get("search") || "",

    purpose:
      searchParams.get("purpose") || "",

    propertyType:
      searchParams.get("propertyType") || "",

    category:
      searchParams.get("category") || "",

    society:
      searchParams.get("society") || "",

    block:
      searchParams.get("block") || "",

    minPrice:
      searchParams.get("minPrice") || "",

    maxPrice:
      searchParams.get("maxPrice") || "",

    minSize:
      searchParams.get("minSize") || "",

    maxSize:
      searchParams.get("maxSize") || "",

    sort:
      searchParams.get("sort") || "",
  };


  /*
  =========================================
  PAGE
  =========================================
  */

  const page =
    Number(
      searchParams.get("page")
    ) || 1;


  /*
  =========================================
  FETCH PROPERTIES
  =========================================
  */

  useEffect(() => {

    const fetchProperties =
      async () => {

        try {

          setLoading(true);
          setError("");


          const response =
            await api.get(
              "/properties",
              {
                params: {

                  page,

                  limit: 12,

                  search:
                    filters.search ||
                    undefined,

                  purpose:
                    filters.purpose ||
                    undefined,

                  propertyType:
                    filters.propertyType ||
                    undefined,

                  category:
                    filters.category ||
                    undefined,

                  society:
                    filters.society ||
                    undefined,

                  block:
                    filters.block ||
                    undefined,

                  minPrice:
                    filters.minPrice ||
                    undefined,

                  maxPrice:
                    filters.maxPrice ||
                    undefined,

                  minSize:
                    filters.minSize ||
                    undefined,

                  maxSize:
                    filters.maxSize ||
                    undefined,

                  sort:
                    filters.sort ||
                    undefined,

                  status:
                    "published",
                },
              }
            );


          setProperties(
            response.data?.properties ||
              []
          );


          const apiPagination =
            response.data?.pagination;


          if (apiPagination) {

            setPagination({
              total:
                apiPagination.total ||
                0,

              totalPages:
                apiPagination.totalPages ||
                1,

              page:
                apiPagination.page ||
                page,

              limit:
                apiPagination.limit ||
                12,
            });

          } else {

            setPagination({
              total:
                response.data?.total ||
                0,

              totalPages:
                response.data?.totalPages ||
                1,

              page:
                response.data?.page ||
                page,

              limit:
                response.data?.limit ||
                12,
            });

          }

        } catch (error) {

          console.error(
            "Fetch properties error:",
            error
          );

          setError(
            error.response?.data?.message ||
              "Failed to load properties."
          );

          setProperties([]);

        } finally {

          setLoading(false);

        }

      };


    fetchProperties();

  }, [
    searchParams.toString(),
  ]);


  /*
  =========================================
  UPDATE FILTER
  =========================================
  */

  const updateFilter = (
    name,
    value
  ) => {

    const params =
      new URLSearchParams(
        searchParams
      );


    /*
    =========================================
    SOCIETY
    =========================================
    */

    if (
      name === "society"
    ) {

      if (value) {

        params.set(
          "society",
          value
        );

      } else {

        params.delete(
          "society"
        );

      }


      /*
       * Remove block when society changes.
       */

      params.delete(
        "block"
      );

    }


    /*
    =========================================
    BLOCK
    =========================================
    */

    else if (
      name === "block"
    ) {

      if (value) {

        params.set(
          "block",
          value
        );

      } else {

        params.delete(
          "block"
        );

      }

    }


    /*
    =========================================
    ALL OTHER FILTERS
    =========================================
    */

    else {

      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {

        params.set(
          name,
          value
        );

      } else {

        params.delete(
          name
        );

      }

    }


    /*
    =========================================
    RESET PAGE
    =========================================
    */

    params.set(
      "page",
      "1"
    );


    setSearchParams(
      params
    );

  };


  /*
  =========================================
  CLEAR FILTERS
  =========================================
  */

  const clearFilters = () => {

    setSearchParams({});

  };


  /*
  =========================================
  CHANGE PAGE
  =========================================
  */

  const changePage =
    (newPage) => {

      const params =
        new URLSearchParams(
          searchParams
        );


      params.set(
        "page",
        String(newPage)
      );


      setSearchParams(
        params
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    };


  return (
    <div className="properties-page">

      <Navbar />


      <main>

        {/* =================================
            PROPERTY PAGE INTRO
        ================================= */}

        <section className="properties-intro-section">

          <div className="properties-intro-container">

            <div className="properties-intro-content">

              <span className="properties-intro-label">
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

          </div>

        </section>


        {/* =================================
            PROPERTIES
        ================================= */}

        <section className="properties-section">

          <div className="properties-container">


            {/* =================================
                FILTERS
            ================================= */}

            <PropertyFilters
              filters={filters}
              onFilterChange={
                updateFilter
              }
              onClear={
                clearFilters
              }
            />


            {/* =================================
                RESULTS HEADER
            ================================= */}

            <div className="properties-results-header">

              <div className="properties-results-title">

                <span className="results-label">
                  PROPERTY LISTINGS
                </span>


                <h2>

                  {loading
                    ? "Finding properties..."
                    : `${pagination.total || 0} Properties`}

                </h2>

              </div>


              {/* =================================
                  SORT
              ================================= */}

              <div className="properties-sort">

                <label htmlFor="sort">
                  Sort
                </label>


                <select
                  id="sort"
                  value={
                    filters.sort
                  }
                  onChange={(e) =>
                    updateFilter(
                      "sort",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Recommended
                  </option>


                  <option value="price_low">
                    Price: Low to High
                  </option>


                  <option value="price_high">
                    Price: High to Low
                  </option>


                  <option value="newest">
                    Newest
                  </option>


                  <option value="oldest">
                    Oldest
                  </option>


                  <option value="views">
                    Most Viewed
                  </option>

                </select>

              </div>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (
              <div className="properties-error">
                {error}
              </div>
            )}


            {/* =================================
                LOADING
            ================================= */}

            {loading ? (

              <div className="properties-loading">

                <div className="properties-spinner" />

                <p>
                  Loading properties...
                </p>

              </div>

            ) : properties.length === 0 ? (

              <div className="properties-empty">

                <div className="empty-icon">
                  G
                </div>


                <h2>
                  No properties found
                </h2>


                <p>
                  We couldn't find any
                  properties matching
                  your search criteria.
                </p>


                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <div className="properties-grid">

                {properties.map(
                  (property) => (

                    <PropertyListCard
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


            {/* =================================
                PAGINATION
            ================================= */}

            {!loading &&
              properties.length > 0 &&
              pagination.totalPages > 1 && (

                <PropertyPagination
                  page={page}
                  totalPages={
                    pagination.totalPages
                  }
                  onPageChange={
                    changePage
                  }
                />

              )}

          </div>

        </section>

      </main>


      <Footer />

    </div>
  );
};

export default Properties;