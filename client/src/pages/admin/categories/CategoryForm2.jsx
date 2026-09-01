import { useEffect, useState } from "react";

import api from "../../../services/api";

import "./CategoryForm2.css";

const CategoryForm = ({
  category,
  onClose,
  onSuccess,
}) => {
  const isEditing = Boolean(
    category
  );

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      image: "",
      isActive: true,
      displayOrder: 0,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name:
          category.name || "",
        description:
          category.description || "",
        image:
          category.image || "",
        isActive:
          category.isActive !== false,
        displayOrder:
          category.displayOrder ?? 0,
      });
    }
  }, [category]);

  /*
   * =========================================
   * INPUT CHANGE
   * =========================================
   */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
   * =========================================
   * SUBMIT
   * =========================================
   */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError(
        "Category name is required."
      );

      return;
    }

    try {
      setLoading(true);

      let response;

      const payload = {
        name:
          formData.name.trim(),

        description:
          formData.description.trim(),

        image:
          formData.image.trim(),

        isActive:
          formData.isActive,

        displayOrder:
          Number(
            formData.displayOrder
          ) || 0,
      };

      if (isEditing) {
        response =
          await api.put(
            `/categories/${category._id}`,
            payload
          );
      } else {
        response =
          await api.post(
            "/categories",
            payload
          );
      }

      const savedCategory =
        response.data?.category;

      if (!savedCategory) {
        throw new Error(
          "Invalid server response."
        );
      }

      onSuccess(
        savedCategory,
        isEditing
      );
    } catch (error) {
      console.error(
        "Category save error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          error.message ||
          "Failed to save category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="category-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="category-modal">

        {/* =================================
            HEADER
        ================================= */}

        <div className="category-modal-header">

          <div>
            <span>
              PROPERTY MANAGEMENT
            </span>

            <h2>
              {isEditing
                ? "Edit Category"
                : "Add Category"}
            </h2>
          </div>

          <button
            type="button"
            className="category-modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* =================================
            FORM
        ================================= */}

        <form
          className="category-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="category-form-error">
              {error}
            </div>
          )}

          {/* Name */}

          <div className="category-form-field">

            <label htmlFor="name">
              Category Name
              <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="e.g. Residential Plots"
              disabled={loading}
            />

          </div>

          {/* Description */}

          <div className="category-form-field">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Brief description of this category..."
              rows="4"
              disabled={loading}
            />

          </div>

          {/* Image */}

          <div className="category-form-field">

            <label htmlFor="image">
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="text"
              value={
                formData.image
              }
              onChange={
                handleChange
              }
              placeholder="https://..."
              disabled={loading}
            />

            <small>
              You can add Cloudinary image
              upload functionality here later.
            </small>

          </div>

          {/* Row */}

          <div className="category-form-row">

            {/* Display Order */}

            <div className="category-form-field">

              <label htmlFor="displayOrder">
                Display Order
              </label>

              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min="0"
                value={
                  formData.displayOrder
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

            </div>

            {/* Active */}

            <label className="category-active-toggle">

              <input
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

              <span className="category-toggle" />

              <span>
                Active Category
              </span>

            </label>

          </div>

          {/* =================================
              ACTIONS
          ================================= */}

          <div className="category-form-actions">

            <button
              type="button"
              className="category-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="category-save-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Category"
                : "Create Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CategoryForm;