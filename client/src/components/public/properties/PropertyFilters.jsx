import { useEffect, useState } from "react";

import api from "../../../services/api";

import "./PropertyFilters.css";

const PropertyFilters = ({
  filters,
  onFilterChange,
  onClear,
}) => {

  const [categories, setCategories] =
    useState([]);

  const [societies, setSocieties] =
    useState([]);

  const [blocks, setBlocks] =
    useState([]);

  const [loadingSocieties, setLoadingSocieties] =
    useState(false);

  const [loadingBlocks, setLoadingBlocks] =
    useState(false);


  /*
  =========================================
  FETCH CATEGORIES
  =========================================
  */

  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          const response =
            await api.get(
              "/categories"
            );


          setCategories(
            response.data?.categories ||
              []
          );

        } catch (error) {

          console.error(
            "Categories error:",
            error
          );

          setCategories([]);

        }

      };


    fetchCategories();

  }, []);


  /*
  =========================================
  FETCH SOCIETIES
  =========================================
  */

  useEffect(() => {

    const fetchSocieties =
      async () => {

        try {

          setLoadingSocieties(true);


          const response =
            await api.get(
              "/locations",
              {
                params: {
                  type: "society",
                },
              }
            );


          setSocieties(
            response.data?.locations ||
              []
          );

        } catch (error) {

          console.error(
            "Societies error:",
            error
          );

          setSocieties([]);

        } finally {

          setLoadingSocieties(false);

        }

      };


    fetchSocieties();

  }, []);


  /*
  =========================================
  FIND SELECTED SOCIETY
  =========================================

  IMPORTANT:

  filters.society contains the SOCIETY NAME.

  Example:

  filters.society
  =
  "Gulberg Greens"

  But to fetch blocks we need:

  Gulberg Greens._id
  =========================================
  */

  const selectedSociety =
    societies.find(
      (society) =>
        society.name ===
        filters.society
    );


  /*
  =========================================
  FETCH BLOCKS
  =========================================

  Only fetch blocks when a valid
  society is selected.
  =========================================
  */

  useEffect(() => {

    const fetchBlocks =
      async () => {

        /*
         * No society selected.
         */

        if (
          !filters.society ||
          !selectedSociety?._id
        ) {

          setBlocks([]);

          return;

        }


        try {

          setLoadingBlocks(true);


          const response =
            await api.get(
              "/locations",
              {
                params: {

                  type: "block",

                  /*
                   * IMPORTANT:
                   *
                   * This is the society
                   * MongoDB _id.
                   *
                   * NOT the society name.
                   */

                  parentLocation:
                    selectedSociety._id,

                },
              }
            );


          setBlocks(
            response.data?.locations ||
              []
          );

        } catch (error) {

          console.error(
            "Blocks error:",
            error
          );

          setBlocks([]);

        } finally {

          setLoadingBlocks(false);

        }

      };


    fetchBlocks();

  }, [
    filters.society,
    selectedSociety?._id,
  ]);


  /*
  =========================================
  RENDER
  =========================================
  */

  return (
    <div className="property-filters">


      {/* =================================
          HEADER
      ================================= */}

      <div className="property-filters-header">

        <div>

          <span className="property-filters-label">
            SEARCH
          </span>

          <h3>
            Find your property
          </h3>

        </div>


        <button
          type="button"
          onClick={onClear}
          className="property-clear-button"
        >
          Clear all
        </button>

      </div>


      {/* =================================
          FILTER GRID
      ================================= */}

      <div className="property-filter-grid">


        {/* =================================
            SEARCH
        ================================= */}

        <div className="property-filter-field property-search-field">

          <label>
            Search
          </label>


          <input
            type="text"
            placeholder="Search properties..."
            value={
              filters.search
            }
            onChange={(e) =>
              onFilterChange(
                "search",
                e.target.value
              )
            }
          />

        </div>


        {/* =================================
            PURPOSE
        ================================= */}

        <div className="property-filter-field">

          <label>
            Purpose
          </label>


          <select
            value={
              filters.purpose
            }
            onChange={(e) =>
              onFilterChange(
                "purpose",
                e.target.value
              )
            }
          >

            <option value="">
              All
            </option>

            <option value="sale">
              For Sale
            </option>

            <option value="rent">
              For Rent
            </option>

          </select>

        </div>


        {/* =================================
            PROPERTY TYPE
        ================================= */}

        <div className="property-filter-field">

          <label>
            Property Type
          </label>


          <select
            value={
              filters.propertyType
            }
            onChange={(e) =>
              onFilterChange(
                "propertyType",
                e.target.value
              )
            }
          >

            <option value="">
              All
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


        {/* =================================
            CATEGORY
        ================================= */}

        <div className="property-filter-field">

          <label>
            Category
          </label>


          <select
            value={
              filters.category
            }
            onChange={(e) =>
              onFilterChange(
                "category",
                e.target.value
              )
            }
          >

            <option value="">
              All Categories
            </option>


            {categories.map(
              (category) => (

                <option
                  key={
                    category._id
                  }
                  value={
                    category._id
                  }
                >
                  {
                    category.name
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* =================================
            SOCIETY
        ================================= */}

        <div className="property-filter-field">

          <label>
            Society
          </label>


          <select
            value={
              filters.society
            }
            onChange={(e) =>
              onFilterChange(
                "society",
                e.target.value
              )
            }
            disabled={
              loadingSocieties
            }
          >

            <option value="">
              {loadingSocieties
                ? "Loading societies..."
                : "All Societies"}
            </option>


            {societies.map(
              (society) => (

                <option
                  key={
                    society._id
                  }

                  /*
                   * IMPORTANT:
                   *
                   * Property.society is
                   * stored as a STRING.
                   *
                   * Therefore the value
                   * must be the NAME.
                   */

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


        {/* =================================
            BLOCK
        ================================= */}

        <div className="property-filter-field">

          <label>
            Block
          </label>


          <select
            value={
              filters.block
            }

            disabled={
              !filters.society ||
              loadingBlocks
            }

            onChange={(e) =>
              onFilterChange(
                "block",
                e.target.value
              )
            }
          >

            <option value="">

              {!filters.society
                ? "Select Society First"
                : loadingBlocks
                ? "Loading blocks..."
                : "All Blocks"}

            </option>


            {blocks.map(
              (block) => (

                <option
                  key={
                    block._id
                  }

                  /*
                   * Property.block is a
                   * STRING.
                   *
                   * Therefore use block.name.
                   */

                  value={
                    block.name
                  }
                >
                  {
                    block.name
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* =================================
            MIN PRICE
        ================================= */}

        <div className="property-filter-field">

          <label>
            Min Price
          </label>


          <input
            type="number"
            placeholder="Minimum"
            value={
              filters.minPrice
            }
            onChange={(e) =>
              onFilterChange(
                "minPrice",
                e.target.value
              )
            }
          />

        </div>


        {/* =================================
            MAX PRICE
        ================================= */}

        <div className="property-filter-field">

          <label>
            Max Price
          </label>


          <input
            type="number"
            placeholder="Maximum"
            value={
              filters.maxPrice
            }
            onChange={(e) =>
              onFilterChange(
                "maxPrice",
                e.target.value
              )
            }
          />

        </div>


        {/* =================================
            MIN SIZE
        ================================= */}

        <div className="property-filter-field">

          <label>
            Min Size
          </label>


          <input
            type="number"
            placeholder="Minimum"
            value={
              filters.minSize
            }
            onChange={(e) =>
              onFilterChange(
                "minSize",
                e.target.value
              )
            }
          />

        </div>


      </div>

    </div>
  );
};

export default PropertyFilters;