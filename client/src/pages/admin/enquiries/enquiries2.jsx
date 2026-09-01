import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import api from "../../../services/api";

import "./Enquiries2.css";

const Enquiries = () => {
  const navigate = useNavigate();
  
  const [enquiries, setEnquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 20,
      total: 0,
      pages: 1
    });

  const [updatingId, setUpdatingId] =
    useState(null);

  /*
   * Fetch enquiries
   */
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 20
      };

      if (search.trim()) {
        params.search =
          search.trim();
      }

      if (status) {
        params.status = status;
      }

      const response =
        await api.get(
          "/enquiries",
          { params }
        );

      setEnquiries(
        response.data.enquiries || []
      );

      setPagination(
        response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1
        }
      );

    } catch (error) {
      console.error(
        "Fetch enquiries error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, status]);

  /*
   * Search
   */
  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchEnquiries();
  };

  /*
   * Update status
   */
  const handleStatusChange = async (
    enquiryId,
    newStatus
  ) => {
    try {
      setUpdatingId(enquiryId);

      await api.put(
        `/enquiries/${enquiryId}`,
        {
          status: newStatus
        }
      );

      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === enquiryId
            ? {
                ...enquiry,
                status: newStatus
              }
            : enquiry
        )
      );

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
      setUpdatingId(null);
    }
  };

  /*
   * Delete enquiry
   */
  const handleDelete = async (
    enquiryId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this enquiry?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(enquiryId);

      await api.delete(
        `/enquiries/${enquiryId}`
      );

      setEnquiries((prev) =>
        prev.filter(
          (enquiry) =>
            enquiry._id !== enquiryId
        )
      );

    } catch (error) {
      console.error(
        "Delete enquiry error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete enquiry."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * Status badge
   */
  const getStatusClass = (value) => {
    return `enquiry-status enquiry-status-${value}`;
  };

  /*
   * Format date
   */
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <div className="admin-main">

          <AdminNavbar />

          <main className="enquiries-content">

            <div className="enquiries-loading">
              Loading enquiries...
            </div>

          </main>

        </div>

      </div>
    );
  }

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="enquiries-content">

          {/* =========================
              HEADER
          ========================== */}

          <div className="enquiries-header">

            <div>

              <h2>
                Enquiries
              </h2>

              <p>
                Manage buyer enquiries
                and follow-ups.
              </p>

            </div>

            <div className="enquiries-total">

              <span>
                Total
              </span>

              <strong>
                {pagination.total}
              </strong>

            </div>

          </div>

          {/* =========================
              ERROR
          ========================== */}

          {error && (
            <div className="enquiry-alert">
              {error}
            </div>
          )}

          {/* =========================
              FILTERS
          ========================== */}

          <section className="enquiries-filters">

            <form
              className="enquiry-search"
              onSubmit={
                handleSearch
              }
            >

              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              <button type="submit">
                Search
              </button>

            </form>

            <select
              value={status}
              onChange={(e) => {
                setStatus(
                  e.target.value
                );
                setPage(1);
              }}
            >

              <option value="">
                All Status
              </option>

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

          </section>

          {/* =========================
              TABLE
          ========================== */}

          <section className="enquiries-table-card">

            <div className="table-wrapper">

              <table className="enquiries-table">

                <thead>

                  <tr>

                    <th>
                      Buyer
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Contact
                    </th>

                    <th>
                      Message
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {enquiries.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="empty-enquiries"
                      >
                        <div>
                          <strong>
                            No enquiries found
                          </strong>

                          <span>
                            Buyer enquiries
                            will appear here.
                          </span>
                        </div>
                      </td>

                    </tr>

                  ) : (

                    enquiries.map(
                      (enquiry) => (

                        <tr
                          key={
                            enquiry._id
                          }
                        >

                          {/* Buyer */}

                          <td>

                            <div className="buyer-info">

                              <div className="buyer-avatar">
                                {enquiry.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}
                              </div>

                              <div>

                                <strong>
                                  {
                                    enquiry.name
                                  }
                                </strong>

                                {enquiry.email && (
                                  <span>
                                    {
                                      enquiry.email
                                    }
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* Property */}

                          <td>

                            <div className="enquiry-property">

                              <strong>
                                {enquiry
                                  .property
                                  ?.title ||
                                  "Property"}
                              </strong>

                              <span>
                                {enquiry
                                  .property
                                  ?.society ||
                                  ""}

                                {enquiry
                                  .property
                                  ?.block &&
                                  ` • Block ${enquiry.property.block}`}
                              </span>

                            </div>

                          </td>

                          {/* Contact */}

                          <td>

                            <span className="phone-number">
                              {
                                enquiry.phone
                              }
                            </span>

                          </td>

                          {/* Message */}

                          <td>

                            <span className="enquiry-message">
                              {enquiry.message
                                ? enquiry.message
                                    .length >
                                  55
                                  ? `${enquiry.message.slice(
                                      0,
                                      55
                                    )}...`
                                  : enquiry.message
                                : "No message"}
                            </span>

                          </td>

                          {/* Status */}

                          <td>

                            <select
                              className={getStatusClass(
                                enquiry.status
                              )}
                              value={
                                enquiry.status
                              }
                              disabled={
                                updatingId ===
                                enquiry._id
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  enquiry._id,
                                  e.target.value
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

                          </td>

                          {/* Date */}

                          <td>

                            <span className="enquiry-date">
                              {formatDate(
                                enquiry.createdAt
                              )}
                            </span>

                          </td>

                          {/* Actions */}

                          <td>

                            <div className="enquiry-actions">

                              <button
                                type="button"
                                className="view-enquiry-button"
                                onClick={() =>
                                  navigate(
                                    `/admin/enquiries/${enquiry._id}`
                                  )
                                }
                              >
                                View
                              </button>

                              <button
                                type="button"
                                className="delete-enquiry-button"
                                disabled={
                                  updatingId ===
                                  enquiry._id
                                }
                                onClick={() =>
                                  handleDelete(
                                    enquiry._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* =========================
                PAGINATION
            ========================== */}

            {pagination.pages >
              1 && (

              <div className="enquiries-pagination">

                <button
                  type="button"
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (prev) =>
                        prev - 1
                    )
                  }
                >
                  Previous
                </button>

                <span>
                  Page{" "}
                  <strong>
                    {pagination.page}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {pagination.pages}
                  </strong>
                </span>

                <button
                  type="button"
                  disabled={
                    page >=
                    pagination.pages
                  }
                  onClick={() =>
                    setPage(
                      (prev) =>
                        prev + 1
                    )
                  }
                >
                  Next
                </button>

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
};

export default Enquiries;