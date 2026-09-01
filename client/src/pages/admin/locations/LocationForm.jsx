import { useEffect, useState } from "react";

import api from "../../../services/api";

import "./LocationForm.css";

const LocationForm = ({
  location,
  onClose,
  onSuccess,
}) => {
  const isEditing = Boolean(location);

  const [societies, setSocieties] =
    useState([]);

  const [societiesLoading, setSocietiesLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      image: "",
      type: "society",
      parentLocation: "",
      isActive: true,
      displayOrder: 0,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  =========================================
  FETCH SOCIETIES
  =========================================
  */

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setSocietiesLoading(true);

        const response =
          await api.get(
            "/locations?type=society"
          );

        setSocieties(
          response.data?.locations || []
        );
      } catch (error) {
        console.error(
          "Fetch societies error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load societies."
        );
      } finally {
        setSocietiesLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  /*
  =========================================
  LOAD EDIT DATA
  =========================================
  */

  useEffect(() => {
    if (location) {
      setFormData({
        name:
          location.name || "",

        description:
          location.description || "",

        image:
          location.image || "",

        type:
          location.type || "society",

        parentLocation:
          location.parentLocation?._id ||
          location.parentLocation ||
          "",

        isActive:
          location.isActive !== false,

        displayOrder:
          location.displayOrder ?? 0,
      });
    }
  }, [location]);

  /*
  =========================================
  HANDLE CHANGE
  =========================================
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

    /*
     * Society doesn't need parent.
     */

    if (
      name === "type" &&
      value === "society"
    ) {
      setFormData((previous) => ({
        ...previous,

        type: "society",
        parentLocation: "",
      }));
    }
  };

  /*
  =========================================
  SUBMIT
  =========================================
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError(
        "Location name is required."
      );

      return;
    }

    /*
     * Block must have parent society
     */

    if (
      formData.type === "block" &&
      !formData.parentLocation
    ) {
      setError(
        "Please select the society this block belongs to."
      );

      return;
    }

    try {
      setLoading(true);

      const payload = {
        name:
          formData.name.trim(),

        description:
          formData.description.trim(),

        image:
          formData.image.trim(),

        type:
          formData.type,

        parentLocation:
          formData.type === "block"
            ? formData.parentLocation
            : null,

        isActive:
          formData.isActive,

        displayOrder:
          Number(
            formData.displayOrder
          ) || 0,
      };

      let response;

      if (isEditing) {
        response =
          await api.put(
            `/locations/${location._id}`,
            payload
          );
      } else {
        response =
          await api.post(
            "/locations",
            payload
          );
      }

      const savedLocation =
        response.data?.location;

      if (!savedLocation) {
        throw new Error(
          "Invalid server response."
        );
      }

      onSuccess(
        savedLocation,
        isEditing
      );
    } catch (error) {
  console.error(
    "Location save error:",
    error
  );

  console.error(
    "Server response:",
    error.response?.data
  );

  setError(
    error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to save location."
  );
}finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="location-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="location-modal">

        {/* HEADER */}

        <div className="location-modal-header">

          <div>
            <span>
              LOCATION MANAGEMENT
            </span>

            <h2>
              {isEditing
                ? "Edit Location"
                : "Add Location"}
            </h2>
          </div>

          <button
            type="button"
            className="location-modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* FORM */}

        <form
          className="location-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="location-form-error">
              {error}
            </div>
          )}

          {/* NAME */}

          <div className="location-form-field">

            <label htmlFor="name">
              Location Name
              <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                formData.type === "society"
                  ? "e.g. Gulberg Residencia"
                  : "e.g. Block A"
              }
              disabled={loading}
            />

          </div>

          {/* TYPE */}

          <div className="location-form-field">

            <label htmlFor="type">
              Location Type
              <span>*</span>
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
            >

              <option value="society">
                Society
              </option>

              <option value="block">
                Block
              </option>

              <option value="area">
                Area
              </option>

            </select>

          </div>

          {/* PARENT SOCIETY */}

          {formData.type === "block" && (
            <div className="location-form-field">

              <label htmlFor="parentLocation">
                Belongs to Society
                <span>*</span>
              </label>

              <select
                id="parentLocation"
                name="parentLocation"
                value={
                  formData.parentLocation
                }
                onChange={handleChange}
                disabled={
                  loading ||
                  societiesLoading
                }
              >

                <option value="">
                  {societiesLoading
                    ? "Loading societies..."
                    : "Select society"}
                </option>

                {societies.map(
                  (society) => (
                    <option
                      key={society._id}
                      value={society._id}
                    >
                      {society.name}
                    </option>
                  )
                )}

              </select>

              {!societiesLoading &&
                societies.length === 0 && (
                  <small className="field-help-error">
                    Create a society first.
                  </small>
                )}

            </div>
          )}

          {/* DESCRIPTION */}

          <div className="location-form-field">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Brief description of this location..."
              rows="4"
              disabled={loading}
            />

          </div>

          {/* IMAGE */}

          <div className="location-form-field">

            <label htmlFor="image">
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              disabled={loading}
            />

          </div>

          {/* ORDER + ACTIVE */}

          <div className="location-form-row">

            <div className="location-form-field">

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
                onChange={handleChange}
                disabled={loading}
              />

            </div>

            <label className="location-active-toggle">

              <input
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={handleChange}
                disabled={loading}
              />

              <span className="location-toggle" />

              <span>
                Active Location
              </span>

            </label>

          </div>

          {/* ACTIONS */}

          <div className="location-form-actions">

            <button
              type="button"
              className="location-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="location-save-button"
              disabled={
                loading ||
                (
                  formData.type ===
                    "block" &&
                  societies.length === 0
                )
              }
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Location"
                : "Create Location"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default LocationForm;