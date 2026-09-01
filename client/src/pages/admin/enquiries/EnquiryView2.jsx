import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import api from "../../../services/api";

import "./EnquiryView.css";

const EnquiryView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updating, setUpdating] = useState(false);

  /*
   * =========================================
   * FETCH ENQUIRY
   * =========================================
   */

  const fetchEnquiry = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/enquiries/${id}`
      );

      setEnquiry(
        response.data?.enquiry ||
          response.data?.data ||
          null
      );
    } catch (error) {
      console.error(
        "Fetch enquiry error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load enquiry."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEnquiry();
    }
  }, [id]);

  /*
   * =========================================
   * UPDATE STATUS
   * =========================================
   */

  const handleStatusChange = async (newStatus) => {
    if (!enquiry) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      await api.put(
        `/enquiries/${enquiry._id}`,
        {
          status: newStatus,
        }
      );

      setEnquiry((previous) => ({
        ...previous,
        status: newStatus,
      }));
    } catch (error) {
      console.error(
        "Update enquiry error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update enquiry."
      );
    } finally {
      setUpdating(false);
    }
  };

  /*
   * =========================================
   * DELETE
   * =========================================
   */

  const handleDelete = async () => {
    if (!enquiry) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      await api.delete(
        `/enquiries/${enquiry._id}`
      );

      navigate("/admin/enquiries");
    } catch (error) {
      console.error(
        "Delete enquiry error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete enquiry."
      );

      setUpdating(false);
    }
  };

  /*
   * =========================================
   * FORMAT DATE
   * =========================================
   */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * =========================================
   * FORMAT DATE + TIME
   * =========================================
   */

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <div className="admin-main">

          <AdminNavbar />

          <main className="enquiry-view-content">

            <div className="enquiry-view-loading">
              Loading enquiry...
            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
   * =========================================
   * ERROR / NOT FOUND
   * =========================================
   */

  if (!enquiry) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <div className="admin-main">

          <AdminNavbar />

          <main className="enquiry-view-content">

            <div className="enquiry-view-not-found">

              <div className="not-found-icon">
                !
              </div>

              <h2>
                Enquiry Not Found
              </h2>

              <p>
                {error ||
                  "The enquiry you are looking for does not exist."}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/enquiries"
                  )
                }
              >
                Back to Enquiries
              </button>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
   * =========================================
   * MAIN
   * =========================================
   */

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="enquiry-view-content">

          {/* =================================
              TOP BAR
          ================================= */}

          <div className="enquiry-view-topbar">

            <button
              type="button"
              className="back-enquiries-button"
              onClick={() =>
                navigate(
                  "/admin/enquiries"
                )
              }
            >
              ← Back to Enquiries
            </button>

            <span className="enquiry-view-reference">
              ENQUIRY DETAILS
            </span>

          </div>

          {/* =================================
              HEADER
          ================================= */}

          <div className="enquiry-view-header">

            <div>

              <span className="enquiry-view-eyebrow">
                BUYER ENQUIRY
              </span>

              <h1>
                {enquiry.name ||
                  "Unknown Buyer"}
              </h1>

              <p>
                Submitted on{" "}
                {formatDateTime(
                  enquiry.createdAt
                )}
              </p>

            </div>

            <div className="enquiry-header-actions">

              <select
                className={`enquiry-detail-status enquiry-detail-status-${enquiry.status}`}
                value={
                  enquiry.status || "new"
                }
                disabled={updating}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value
                  )
                }
              >

                <option value="new">
                  New
                </option>

                <option value="contacted">
                  Contacted
                </option>

                <option value="closed">
                  Closed
                </option>

              </select>

              <button
                type="button"
                className="detail-delete-button"
                onClick={handleDelete}
                disabled={updating}
              >
                {updating
                  ? "Processing..."
                  : "Delete"}
              </button>

            </div>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="enquiry-view-alert">
              {error}
            </div>
          )}

          {/* =================================
              MAIN GRID
          ================================= */}

          <div className="enquiry-view-grid">

            {/* =================================
                LEFT
            ================================= */}

            <div className="enquiry-view-main">

              {/* =================================
                  BUYER INFORMATION
              ================================= */}

              <section className="enquiry-detail-card">

                <div className="detail-card-header">

                  <div>

                    <span>
                      CUSTOMER
                    </span>

                    <h2>
                      Buyer Information
                    </h2>

                  </div>

                </div>

                <div className="buyer-detail">

                  <div className="buyer-detail-avatar">
                    {enquiry.name
                      ?.charAt(0)
                      ?.toUpperCase() || "?"}
                  </div>

                  <div className="buyer-detail-info">

                    <h3>
                      {enquiry.name ||
                        "Unknown Buyer"}
                    </h3>

                    <div className="buyer-detail-contact">

                      {enquiry.email && (
                        <a
                          href={`mailto:${enquiry.email}`}
                        >
                          {enquiry.email}
                        </a>
                      )}

                      {enquiry.phone && (
                        <a
                          href={`tel:${enquiry.phone}`}
                        >
                          {enquiry.phone}
                        </a>
                      )}

                    </div>

                  </div>

                </div>

              </section>


              {/* =================================
                  MESSAGE
              ================================= */}

              <section className="enquiry-detail-card">

                <div className="detail-card-header">

                  <div>

                    <span>
                      MESSAGE
                    </span>

                    <h2>
                      Buyer&apos;s Enquiry
                    </h2>

                  </div>

                </div>

                <div className="enquiry-full-message">

                  {enquiry.message ? (
                    <p>
                      {enquiry.message}
                    </p>
                  ) : (
                    <p className="no-message">
                      No message was provided.
                    </p>
                  )}

                </div>

              </section>


              {/* =================================
                  PROPERTY
              ================================= */}

              <section className="enquiry-detail-card">

                <div className="detail-card-header">

                  <div>

                    <span>
                      PROPERTY
                    </span>

                    <h2>
                      Property Information
                    </h2>

                  </div>

                </div>

                <div className="property-detail">

                  <div className="property-detail-icon">
                    G
                  </div>

                  <div className="property-detail-info">

                    <h3>
                      {enquiry.property
                        ?.title ||
                        "Property"}
                    </h3>

                    {enquiry.property
                      ?.society && (
                      <span>
                        {
                          enquiry.property
                            .society
                        }

                        {enquiry.property
                          ?.block &&
                          ` • Block ${enquiry.property.block}`}
                      </span>
                    )}

                  </div>

                </div>

              </section>

            </div>


            {/* =================================
                RIGHT SIDEBAR
            ================================= */}

            <aside className="enquiry-view-sidebar">

              {/* =================================
                  STATUS
              ================================= */}

              <section className="enquiry-side-card">

                <span className="side-card-label">
                  STATUS
                </span>

                <div
                  className={`large-status enquiry-large-status-${enquiry.status}`}
                >
                  <span className="status-dot" />

                  {enquiry.status ===
                  "new"
                    ? "New"
                    : enquiry.status ===
                      "contacted"
                    ? "Contacted"
                    : "Closed"}
                </div>

              </section>


              {/* =================================
                  CONTACT DETAILS
              ================================= */}

              <section className="enquiry-side-card">

                <span className="side-card-label">
                  CONTACT DETAILS
                </span>

                <div className="side-detail-list">

                  <div className="side-detail">

                    <span>
                      FULL NAME
                    </span>

                    <strong>
                      {enquiry.name ||
                        "—"}
                    </strong>

                  </div>

                  <div className="side-detail">

                    <span>
                      EMAIL
                    </span>

                    {enquiry.email ? (
                      <a
                        href={`mailto:${enquiry.email}`}
                      >
                        {enquiry.email}
                      </a>
                    ) : (
                      <strong>
                        —
                      </strong>
                    )}

                  </div>

                  <div className="side-detail">

                    <span>
                      PHONE
                    </span>

                    {enquiry.phone ? (
                      <a
                        href={`tel:${enquiry.phone}`}
                      >
                        {enquiry.phone}
                      </a>
                    ) : (
                      <strong>
                        —
                      </strong>
                    )}

                  </div>

                </div>

              </section>


              {/* =================================
                  ENQUIRY INFO
              ================================= */}

              <section className="enquiry-side-card">

                <span className="side-card-label">
                  ENQUIRY INFORMATION
                </span>

                <div className="side-detail-list">

                  <div className="side-detail">

                    <span>
                      RECEIVED
                    </span>

                    <strong>
                      {formatDate(
                        enquiry.createdAt
                      )}
                    </strong>

                  </div>

                  <div className="side-detail">

                    <span>
                      LAST UPDATED
                    </span>

                    <strong>
                      {formatDate(
                        enquiry.updatedAt
                      )}
                    </strong>

                  </div>

                  <div className="side-detail">

                    <span>
                      ENQUIRY ID
                    </span>

                    <code>
                      {enquiry._id}
                    </code>

                  </div>

                </div>

              </section>

            </aside>

          </div>

        </main>

      </div>

    </div>
  );
};

export default EnquiryView;