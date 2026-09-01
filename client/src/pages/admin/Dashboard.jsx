import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import { getDashboardData } from "../../services/dashboardService";

import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();

      setDashboard(data);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = dashboard?.stats;

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="dashboard-content">

          <div className="dashboard-heading">

            <div>
              <h2>Overview</h2>

              <p>
                Here's what's happening with
                your property platform.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadDashboard}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

          </div>

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          <section className="dashboard-cards">

            <div className="dashboard-card">
              <span>Total Properties</span>

              <strong>
                {loading
                  ? "—"
                  : stats?.totalProperties ?? 0}
              </strong>

              <small>
                All properties
              </small>
            </div>

            <div className="dashboard-card">
              <span>Published</span>

              <strong>
                {loading
                  ? "—"
                  : stats?.publishedProperties ?? 0}
              </strong>

              <small>
                Live properties
              </small>
            </div>

            <div className="dashboard-card">
              <span>Pending</span>

              <strong>
                {loading
                  ? "—"
                  : stats?.pendingProperties ?? 0}
              </strong>

              <small>
                Awaiting review
              </small>
            </div>

            <div className="dashboard-card">
              <span>New Enquiries</span>

              <strong>
                {loading
                  ? "—"
                  : stats?.newEnquiries ?? 0}
              </strong>

              <small>
                Need attention
              </small>
            </div>

          </section>

          <section className="dashboard-grid">

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Recent Properties
                  </h3>

                  <p>
                    Recently added properties
                  </p>
                </div>

                <button>
                  View All
                </button>

              </div>

              {loading ? (
                <div className="empty-state">
                  <p>
                    Loading properties...
                  </p>
                </div>
              ) : dashboard?.recentProperties
                  ?.length ? (

                <div className="recent-list">

                  {dashboard.recentProperties.map(
                    (property) => (
                      <div
                        className="recent-item"
                        key={property._id}
                      >

                        <div className="recent-item-info">

                          <strong>
                            {property.title}
                          </strong>

                          <span>
                            {property.society}
                            {property.block
                              ? ` • Block ${property.block}`
                              : ""}
                          </span>

                        </div>

                        <div className="recent-item-right">

                          <strong>
                            {property.price?.currency}{" "}
                            {property.price?.amount?.toLocaleString()}
                          </strong>

                          <span
                            className={`status-badge status-${property.status}`}
                          >
                            {property.status}
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div className="empty-state">
                  <p>
                    No properties available.
                  </p>
                </div>

              )}

            </div>

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Recent Enquiries
                  </h3>

                  <p>
                    Latest buyer enquiries
                  </p>
                </div>

                <button>
                  View All
                </button>

              </div>

              {loading ? (
                <div className="empty-state">
                  <p>
                    Loading enquiries...
                  </p>
                </div>
              ) : dashboard?.recentEnquiries
                  ?.length ? (

                <div className="recent-list">

                  {dashboard.recentEnquiries.map(
                    (enquiry) => (
                      <div
                        className="recent-item"
                        key={enquiry._id}
                      >

                        <div className="recent-item-info">

                          <strong>
                            {enquiry.name}
                          </strong>

                          <span>
                            {enquiry.property?.title ||
                              "Property enquiry"}
                          </span>

                        </div>

                        <div className="recent-item-right">

                          <span>
                            {enquiry.phone}
                          </span>

                          <span
                            className={`status-badge status-${enquiry.status}`}
                          >
                            {enquiry.status}
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div className="empty-state">
                  <p>
                    No enquiries available.
                  </p>
                </div>

              )}

            </div>

          </section>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;