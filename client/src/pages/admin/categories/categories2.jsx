import { useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import CategoryForm from "./CategoryForm";

import api from "../../../services/api";

import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/categories"
      );

      setCategories(
        response.data?.categories ||
          response.data?.data ||
          []
      );
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /*
   * =========================================
   * ADD
   * =========================================
   */

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  /*
   * =========================================
   * EDIT
   * =========================================
   */

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  /*
   * =========================================
   * DELETE
   * =========================================
   */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);

      await api.delete(
        `/categories/${id}`
      );

      setCategories((previous) =>
        previous.filter(
          (category) =>
            category._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  /*
   * =========================================
   * FORM SUCCESS
   * =========================================
   */

  const handleFormSuccess = (
    category,
    isEditing
  ) => {
    if (isEditing) {
      setCategories((previous) =>
        previous.map((item) =>
          item._id === category._id
            ? category
            : item
        )
      );
    } else {
      setCategories((previous) => [
        ...previous,
        category,
      ]);
    }

    setShowForm(false);
    setEditingCategory(null);
  };

  /*
   * =========================================
   * FORM CLOSE
   * =========================================
   */

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="categories-page">

          {/* =================================
              HEADER
          ================================= */}

          <div className="categories-page-header">

            <div>
              

              <h1>
                Categories
              </h1>

              <p>
                Manage property categories
                displayed across the platform.
              </p>
            </div>

            <button
              className="add-category-button"
              onClick={handleAdd}
            >
              <span>+</span>
              Add Category
            </button>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="categories-page-error">
              {error}
            </div>
          )}

          {/* =================================
              CONTENT
          ================================= */}

          <div className="categories-panel">

            <div className="categories-panel-header">

              <div>
                <h2>
                  All Categories
                </h2>

                <span>
                  {categories.length}{" "}
                  categories
                </span>
              </div>

              <button
                className="refresh-categories"
                onClick={fetchCategories}
                disabled={loading}
              >
                ↻ Refresh
              </button>

            </div>

            {/* =================================
                LOADING
            ================================= */}

            {loading ? (
              <div className="categories-loading">

                <div className="loading-spinner" />

                <p>
                  Loading categories...
                </p>

              </div>
            ) : categories.length === 0 ? (

              /* =================================
                 EMPTY
              ================================= */

              <div className="categories-empty">

                <div className="categories-empty-icon">
                  G
                </div>

                <h3>
                  No categories yet
                </h3>

                <p>
                  Create your first property
                  category to get started.
                </p>

                <button
                  onClick={handleAdd}
                  className="empty-add-button"
                >
                  Add Category
                </button>

              </div>

            ) : (

              /* =================================
                 TABLE
              ================================= */

              <div className="categories-table-wrapper">

                <table className="categories-table">

                  <thead>
                    <tr>
                      <th>
                        Category
                      </th>

                      <th>
                        Slug
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Order
                      </th>

                      <th>
                        Created
                      </th>

                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {categories.map(
                      (category) => (
                        <tr
                          key={
                            category._id
                          }
                        >

                          {/* Category */}

                          <td>

                            <div className="category-table-name">

                              {category.image ? (
                                <img
                                  src={
                                    category.image
                                  }
                                  alt={
                                    category.name
                                  }
                                />
                              ) : (
                                <div className="category-table-placeholder">
                                  G
                                </div>
                              )}

                              <div>
                                <strong>
                                  {
                                    category.name
                                  }
                                </strong>

                                {category.description && (
                                  <span>
                                    {
                                      category.description
                                    }
                                  </span>
                                )}
                              </div>

                            </div>

                          </td>

                          {/* Slug */}

                          <td>
                            <code>
                              {category.slug}
                            </code>
                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={
                                category.isActive
                                  ? "category-status active"
                                  : "category-status inactive"
                              }
                            >
                              <span />
                              {category.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          {/* Order */}

                          <td>
                            <span className="category-order">
                              {
                                category.displayOrder ??
                                0
                              }
                            </span>
                          </td>

                          {/* Created */}

                          <td>
                            <span className="category-date">
                              {category.createdAt
                                ? new Date(
                                    category.createdAt
                                  ).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "—"}
                            </span>
                          </td>

                          {/* Actions */}

                          <td>

                            <div className="category-actions">

                              <button
                                className="edit-category-button"
                                onClick={() =>
                                  handleEdit(
                                    category
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-category-button"
                                onClick={() =>
                                  handleDelete(
                                    category._id
                                  )
                                }
                                disabled={
                                  deleteLoading ===
                                  category._id
                                }
                              >
                                {deleteLoading ===
                                category._id
                                  ? "..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </main>

      </div>

      {/* =================================
          FORM MODAL
      ================================= */}

      {showForm && (
        <CategoryForm
          category={
            editingCategory
          }
          onClose={
            handleFormClose
          }
          onSuccess={
            handleFormSuccess
          }
        />
      )}

    </div>
  );
};

export default Categories;