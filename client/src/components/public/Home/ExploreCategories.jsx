import { useEffect, useState } from "react";

import api from "../../../services/api";

import CategoryCard from "./CategoryCard";

import "./ExploreCategories.css";

const ExploreCategories = () => {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchCategories =
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await api.get(
              "/categories"
            );

          const categoryData =
            response.data?.categories ||
            response.data?.data ||
            [];

          setCategories(
            categoryData
          );
        } catch (error) {
          console.error(
            "Categories error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Unable to load categories."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCategories();
  }, []);

  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {
    return (
      <section className="explore-categories">

        <div className="explore-categories-container">

          <div className="categories-heading">

            <span className="categories-eyebrow">
              EXPLORE PROPERTIES
            </span>

            <h2>
              Find What You're Looking For
            </h2>

            <p>
              Browse properties by category
              and find the right option for
              your needs.
            </p>

          </div>

          <div className="categories-grid">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  className="category-skeleton"
                  key={item}
                >
                  <div className="category-skeleton-shimmer" />
                </div>
              )
            )}

          </div>

        </div>

      </section>
    );
  }

  /*
   * =========================================
   * MAIN
   * =========================================
   */

  return (
    <section className="explore-categories">

      <div className="explore-categories-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="categories-heading">

          <div>

            <span className="categories-eyebrow">
              EXPLORE PROPERTIES
            </span>

            <h2>
              Find What You're Looking For
            </h2>

            <p>
              Browse properties by category
              and find the right option for
              your needs.
            </p>

          </div>

        </div>

        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="categories-error">
            {error}
          </div>
        )}

        {/* =================================
            EMPTY
        ================================= */}

        {!error &&
          categories.length === 0 && (
            <div className="categories-empty">

              <div className="categories-empty-icon">
                G
              </div>

              <h3>
                No categories available
              </h3>

              <p>
                Property categories will
                appear here once they are
                created.
              </p>

            </div>
          )}

        {/* =================================
            CATEGORY GRID
        ================================= */}

        {!error &&
          categories.length > 0 && (
            <div className="categories-grid">

              {categories.map(
                (category) => (
                  <CategoryCard
                    key={
                      category._id
                    }
                    category={
                      category
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

export default ExploreCategories;