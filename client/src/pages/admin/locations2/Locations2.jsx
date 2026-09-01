import { useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import LocationForm from "./LocationForm2";

import api from "../../../services/api";

import "./Locations2.css";

const Locations = () => {
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  /*
   * =========================================
   * FETCH LOCATIONS
   * =========================================
   */

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/locations");

      setLocations(
        response.data?.locations || []
      );
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

  useEffect(() => {
    fetchLocations();
  }, []);

  /*
   * =========================================
   * ADD
   * =========================================
   */

  const handleAdd = () => {
    setEditingLocation(null);
    setShowForm(true);
  };

  /*
   * =========================================
   * EDIT
   * =========================================
   */

  const handleEdit = (location) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  /*
   * =========================================
   * DELETE
   * =========================================
   */

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this location?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);

      await api.delete(
        `/locations/${id}`
      );

      setLocations((previous) =>
        previous.filter(
          (location) =>
            location._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete location error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete location."
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
    location,
    isEditing
  ) => {
    if (isEditing) {
      setLocations((previous) =>
        previous.map((item) =>
          item._id === location._id
            ? location
            : item
        )
      );
    } else {
      setLocations((previous) => [
        ...previous,
        location,
      ]);
    }

    setShowForm(false);
    setEditingLocation(null);
  };

  /*
   * =========================================
   * CLOSE FORM
   * =========================================
   */

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLocation(null);
  };

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="locations-page">

          {/* =================================
              HEADER
          ================================= */}

          <div className="locations-page-header">

            <div>

        
              <h1>
                Locations
              </h1>

              <p>
                Manage societies, blocks and
                areas used across the platform.
              </p>

            </div>

            <button
              className="add-location-button"
              onClick={handleAdd}
            >
              <span>+</span>
              Add Location
            </button>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="locations-page-error">
              {error}
            </div>
          )}

          {/* =================================
              PANEL
          ================================= */}

          <div className="locations-panel">

            <div className="locations-panel-header">

              <div>

                <h2>
                  All Locations
                </h2>

                <span>
                  {locations.length}{" "}
                  locations
                </span>

              </div>

              <button
                className="refresh-locations"
                onClick={fetchLocations}
                disabled={loading}
              >
                ↻ Refresh
              </button>

            </div>

            {/* =================================
                LOADING
            ================================= */}

            {loading ? (

              <div className="locations-loading">

                <div className="location-spinner" />

                <p>
                  Loading locations...
                </p>

              </div>

            ) : locations.length === 0 ? (

              /* =================================
                 EMPTY
              ================================= */

              <div className="locations-empty">

                <div className="locations-empty-icon">
                  G
                </div>

                <h3>
                  No locations yet
                </h3>

                <p>
                  Create your first location
                  to get started.
                </p>

                <button
                  className="empty-location-button"
                  onClick={handleAdd}
                >
                  Add Location
                </button>

              </div>

            ) : (

              /* =================================
                 TABLE
              ================================= */

              <div className="locations-table-wrapper">

                <table className="locations-table">

                  <thead>

                    <tr>

                      <th>
                        Location
                      </th>

                      <th>
                        Type
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

                    {locations.map(
                      (location) => (
                        <tr
                          key={
                            location._id
                          }
                        >

                          {/* Location */}

                          <td>

                            <div className="location-table-name">

                              {location.image ? (

                                <img
                                  src={
                                    location.image
                                  }
                                  alt={
                                    location.name
                                  }
                                />

                              ) : (

                                <div className="location-table-placeholder">
                                  G
                                </div>

                              )}

                              <div>

                                <strong>
                                  {
                                    location.name
                                  }
                                </strong>

                                {location.description && (
                                  <span>
                                    {
                                      location.description
                                    }
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* Type */}

                          <td>

                            <span>
                              {location.type}
                            </span>

                          </td>

                          {/* Slug */}

                          <td>

                            <code>
                              {
                                location.slug
                              }
                            </code>

                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={
                                location.isActive
                                  ? "location-status active"
                                  : "location-status inactive"
                              }
                            >

                              <span />

                              {location.isActive
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </td>

                          {/* Order */}

                          <td>

                            <span className="location-order">
                              {
                                location.displayOrder ??
                                0
                              }
                            </span>

                          </td>

                          {/* Date */}

                          <td>

                            <span className="location-date">

                              {location.createdAt
                                ? new Date(
                                    location.createdAt
                                  ).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "—"}

                            </span>

                          </td>

                          {/* Actions */}

                          <td>

                            <div className="location-actions">

                              <button
                                className="edit-location-button"
                                onClick={() =>
                                  handleEdit(
                                    location
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-location-button"
                                onClick={() =>
                                  handleDelete(
                                    location._id
                                  )
                                }
                                disabled={
                                  deleteLoading ===
                                  location._id
                                }
                              >
                                {deleteLoading ===
                                location._id
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
          LOCATION FORM
      ================================= */}

      {showForm && (
        <LocationForm
          location={
            editingLocation
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

export default Locations;