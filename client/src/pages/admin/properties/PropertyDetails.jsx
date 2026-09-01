import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import api from "../../../services/api";

import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/properties/${id}`
        );

        setProperty(
          response.data.property
        );
      } catch (error) {
        console.error(
          "Fetch property error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(
        `/properties/${id}`
      );

      navigate("/admin/properties");

    } catch (error) {
      console.error(
        "Delete property error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete property."
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminNavbar />

          <main className="property-details-content">
            <div className="details-loading">
              Loading property...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminNavbar />

          <main className="property-details-content">

            <div className="details-error">
              <h2>
                Property not found
              </h2>

              <p>
                {error ||
                  "The property could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/properties"
                  )
                }
              >
                Back to Properties
              </button>
            </div>

          </main>
        </div>
      </div>
    );
  }

  const images = property.images || [];

  const features =
    property.features || [];

  const formatPrice = () => {
    if (
      !property.price ||
      property.price.amount ===
        undefined
    ) {
      return "N/A";
    }

    return new Intl.NumberFormat(
      "en-PK"
    ).format(
      property.price.amount
    );
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .charAt(0)
      .toUpperCase() +
      status.slice(1);
  };

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="property-details-content">

          {/* =========================
              HEADER
          ========================== */}

          <div className="property-details-header">

            <div>

              <div className="breadcrumb">
                Properties
                <span> / </span>
                Details
              </div>

              <h2>
                Property Details
              </h2>

              <p>
                View complete property
                information.
              </p>

            </div>

            <div className="details-header-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    "/admin/properties"
                  )
                }
              >
                Back
              </button>

              <button
                type="button"
                className="edit-property-button"
                onClick={() =>
                  navigate(
                    `/admin/properties/${id}/edit`
                  )
                }
              >
                Edit Property
              </button>

            </div>

          </div>

          {/* =========================
              MAIN CARD
          ========================== */}

          <div className="property-details-card">

            {/* =========================
                IMAGE GALLERY
            ========================== */}

            <section className="property-gallery">

              <div className="main-property-image">

                {images.length > 0 ? (
                  <img
                    src={
                      images[
                        selectedImage
                      ]?.url
                    }
                    alt={
                      property.title
                    }
                  />
                ) : (
                  <div className="no-property-image">
                    No Image Available
                  </div>
                )}

              </div>

              {images.length > 0 && (

                <div className="property-thumbnails">

                  {images.map(
                    (image, index) => (

                      <button
                        type="button"
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                        className={`property-thumbnail ${
                          selectedImage ===
                          index
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedImage(
                            index
                          )
                        }
                      >

                        <img
                          src={image.url}
                          alt={`Property ${
                            index + 1
                          }`}
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </section>

            {/* =========================
                BASIC INFORMATION
            ========================== */}

            <section className="property-overview">

              <div className="property-title-row">

                <div>

                  <div className="property-badges">

                    <span
                      className={`status-badge status-${property.status}`}
                    >
                      {formatStatus(
                        property.status
                      )}
                    </span>

                    {property.isFeatured && (
                      <span className="featured-badge">
                        Featured
                      </span>
                    )}

                  </div>

                  <h1>
                    {property.title}
                  </h1>

                  <p className="property-location">
                    {property.society}

                    {property.block &&
                      ` • Block ${property.block}`}

                    {property.plotNumber &&
                      ` • Plot ${property.plotNumber}`}
                  </p>

                </div>

                <div className="property-price">

                  <span>
                    {property.price?.currency ||
                      "PKR"}
                  </span>

                  <strong>
                    {formatPrice()}
                  </strong>

                </div>

              </div>

              {/* =========================
                  PROPERTY STATS
              ========================== */}

              <div className="property-stats">

                <div className="property-stat">

                  <span>
                    Property Type
                  </span>

                  <strong>
                    {formatStatus(
                      property.propertyType
                    )}
                  </strong>

                </div>

                <div className="property-stat">

                  <span>
                    Purpose
                  </span>

                  <strong>
                    {formatStatus(
                      property.purpose
                    )}
                  </strong>

                </div>

                <div className="property-stat">

                  <span>
                    Size
                  </span>

                  <strong>
                    {property.size?.value}{" "}
                    {property.size?.unit}
                  </strong>

                </div>

                <div className="property-stat">

                  <span>
                    Category
                  </span>

                  <strong>
                    {formatStatus(
                      property.category
                    )}
                  </strong>

                </div>

              </div>

            </section>

            {/* =========================
                DESCRIPTION
            ========================== */}

            <section className="details-section">

              <h3>
                Description
              </h3>

              <p className="property-description">
                {property.description ||
                  "No description available."}
              </p>

            </section>

            {/* =========================
                FEATURES
            ========================== */}

            {features.length > 0 && (

              <section className="details-section">

                <h3>
                  Features
                </h3>

                <div className="features-list">

                  {features.map(
                    (feature, index) => (

                      <span
                        className="feature-item"
                        key={`${feature}-${index}`}
                      >
                        ✓ {feature}
                      </span>

                    )
                  )}

                </div>

              </section>

            )}

            {/* =========================
                LOCATION
            ========================== */}

            <section className="details-section">

              <h3>
                Location
              </h3>

              <div className="location-grid">

                <div>

                  <span>
                    Society
                  </span>

                  <strong>
                    {property.society ||
                      "N/A"}
                  </strong>

                </div>

                <div>

                  <span>
                    Block
                  </span>

                  <strong>
                    {property.block ||
                      "N/A"}
                  </strong>

                </div>

                <div>

                  <span>
                    Plot Number
                  </span>

                  <strong>
                    {property.plotNumber ||
                      "N/A"}
                  </strong>

                </div>

                <div>

                  <span>
                    Street
                  </span>

                  <strong>
                    {property.street ||
                      "N/A"}
                  </strong>

                </div>

                <div className="full-location">

                  <span>
                    Address
                  </span>

                  <strong>
                    {property.location
                      ?.address ||
                      "N/A"}
                  </strong>

                </div>

                <div>

                  <span>
                    Latitude
                  </span>

                  <strong>
                    {property.location
                      ?.latitude ||
                      "N/A"}
                  </strong>

                </div>

                <div>

                  <span>
                    Longitude
                  </span>

                  <strong>
                    {property.location
                      ?.longitude ||
                      "N/A"}
                  </strong>

                </div>

              </div>

            </section>

            {/* =========================
                PROPERTY ID
            ========================== */}

            <section className="details-section">

              <h3>
                Property Information
              </h3>

              <div className="property-meta">

                <div>

                  <span>
                    Property ID
                  </span>

                  <strong>
                    {property.propertyId ||
                      property._id}
                  </strong>

                </div>

                <div>

                  <span>
                    Verification
                  </span>

                  <strong>
                    {formatStatus(
                      property.verificationStatus
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Views
                  </span>

                  <strong>
                    {property.views || 0}
                  </strong>

                </div>

              </div>

            </section>

          </div>

          {/* =========================
              DANGER ZONE
          ========================== */}

          <section className="danger-zone">

            <div>

              <h3>
                Delete Property
              </h3>

              <p>
                Permanently remove this
                property from the system.
                This action cannot be undone.
              </p>

            </div>

            <button
              type="button"
              className="delete-property-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : "Delete Property"}
            </button>

          </section>

        </main>

      </div>

    </div>
  );
};

export default PropertyDetails;