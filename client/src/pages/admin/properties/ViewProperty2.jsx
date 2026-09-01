import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import api from "../../../services/api";

import "./ViewProperty2.css";

const ViewProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
  =========================================
  FETCH PROPERTY
  =========================================
  */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/properties/${id}`
        );

        setProperty(
          response.data?.property || null
        );
      } catch (error) {
        console.error(
          "Fetch property details error:",
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

    if (id) {
      fetchProperty();
    }
  }, [id]);

  /*
  =========================================
  HELPERS
  =========================================
  */

  const formatPrice = () => {
    if (!property?.price?.amount) {
      return "N/A";
    }

    const amount =
      Number(property.price.amount);

    return new Intl.NumberFormat(
      "en-PK"
    ).format(amount);
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
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

  const getCategoryName = () => {
    if (!property?.category) {
      return "N/A";
    }

    if (
      typeof property.category ===
      "object"
    ) {
      return (
        property.category.name ||
        property.category.title ||
        "N/A"
      );
    }

    return property.category;
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (typeof image === "string") {
      return image;
    }

    return (
      image.url ||
      image.secure_url ||
      ""
    );
  };

  const getStatusClass = (status) => {
    return (
      `property-status-badge ` +
      `property-status-${status || "draft"}`
    );
  };

  /*
  =========================================
  LOADING
  =========================================
  */

  if (loading) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <div className="admin-main">

          <AdminNavbar />

          <main className="property-details-content">

            <div className="property-details-loading">

              <div className="property-details-spinner" />

              <p>
                Loading property...
              </p>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
  =========================================
  ERROR
  =========================================
  */

  if (error || !property) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <div className="admin-main">

          <AdminNavbar />

          <main className="property-details-content">

            <div className="property-details-error">

              <div className="property-details-error-icon">
                !
              </div>

              <h2>
                Property not found
              </h2>

              <p>
                {error ||
                  "The requested property could not be found."}
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

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="property-details-content">

          {/* =================================
              HEADER
          ================================= */}

          <div className="property-details-header">

            <div>

              <div className="property-details-breadcrumb">
                Properties
                <span> / </span>
                {property.propertyId ||
                  "Property"}
              </div>

              <div className="property-details-title-row">

                <div>

                  <h1>
                    {property.title}
                  </h1>

                  <p>
                    Property ID:{" "}
                    <strong>
                      {property.propertyId ||
                        "N/A"}
                    </strong>
                  </p>

                </div>

                <span
                  className={getStatusClass(
                    property.status
                  )}
                >
                  {property.status ||
                    "draft"}
                </span>

              </div>

            </div>

            <div className="property-details-actions">

              <button
                type="button"
                className="property-back-button"
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
                className="property-edit-button"
                onClick={() =>
                  navigate(
                    `/admin/properties/${property._id}/edit`
                  )
                }
              >
                Edit Property
              </button>

            </div>

          </div>


          {/* =================================
              MAIN GRID
          ================================= */}

          <div className="property-details-grid">

            {/* =================================
                LEFT COLUMN
            ================================= */}

            <div className="property-details-main">


              {/* =================================
                  IMAGES
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Property Images
                    </h2>

                    <p>
                      Images uploaded for
                      this property.
                    </p>

                  </div>

                  <span>
                    {property.images?.length ||
                      0}{" "}
                    images
                  </span>

                </div>


                {property.images &&
                property.images.length > 0 ? (

                  <div className="property-images-grid">

                    {property.images.map(
                      (image, index) => {

                        const imageUrl =
                          getImageUrl(
                            image
                          );

                        return (
                          <div
                            className={`property-image ${
                              image?.isPrimary ||
                              index === 0
                                ? "primary-image"
                                : ""
                            }`}
                            key={
                              image?._id ||
                              `${imageUrl}-${index}`
                            }
                          >

                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`${property.title} ${
                                  index + 1
                                }`}
                              />
                            ) : (
                              <div className="property-image-placeholder">
                                No Image
                              </div>
                            )}

                            {(image?.isPrimary ||
                              index === 0) && (
                              <span className="primary-image-label">
                                Cover
                              </span>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  <div className="property-no-images">
                    No images available.
                  </div>

                )}

              </section>


              {/* =================================
                  PROPERTY INFORMATION
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Property Information
                    </h2>

                    <p>
                      Basic property
                      information.
                    </p>

                  </div>

                </div>


                <div className="property-info-grid">

                  <div className="property-info-item">

                    <span>
                      Property Type
                    </span>

                    <strong>
                      {property.propertyType ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Purpose
                    </span>

                    <strong>
                      {property.purpose ===
                      "sale"
                        ? "For Sale"
                        : property.purpose ===
                          "rent"
                        ? "For Rent"
                        : "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Category
                    </span>

                    <strong>
                      {getCategoryName()}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Featured
                    </span>

                    <strong>
                      {property.isFeatured
                        ? "Yes"
                        : "No"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Size
                    </span>

                    <strong>
                      {property.size?.value
                        ? `${property.size.value} ${
                            property.size.unit ||
                            ""
                          }`
                        : "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Views
                    </span>

                    <strong>
                      {property.views ||
                        0}
                    </strong>

                  </div>

                </div>

              </section>


              {/* =================================
                  LOCATION
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Location
                    </h2>

                    <p>
                      Property location
                      information.
                    </p>

                  </div>

                </div>


                <div className="property-info-grid">

                  <div className="property-info-item">

                    <span>
                      Society
                    </span>

                    <strong>
                      {property.society ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Block
                    </span>

                    <strong>
                      {property.block ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Plot Number
                    </span>

                    <strong>
                      {property.plotNumber ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Street
                    </span>

                    <strong>
                      {property.street ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item full">

                    <span>
                      Address
                    </span>

                    <strong>
                      {property.location
                        ?.address ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Latitude
                    </span>

                    <strong>
                      {property.location
                        ?.latitude ??
                        "N/A"}
                    </strong>

                  </div>


                  <div className="property-info-item">

                    <span>
                      Longitude
                    </span>

                    <strong>
                      {property.location
                        ?.longitude ??
                        "N/A"}
                    </strong>

                  </div>

                </div>

              </section>


              {/* =================================
                  DESCRIPTION
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Description
                    </h2>

                    <p>
                      Property description
                      provided by the admin.
                    </p>

                  </div>

                </div>

                <div className="property-description">

                  {property.description ||
                    "No description available."}

                </div>

              </section>


              {/* =================================
                  FEATURES
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Features
                    </h2>

                    <p>
                      Property features and
                      highlights.
                    </p>

                  </div>

                </div>


                {property.features &&
                property.features.length > 0 ? (

                  <div className="property-features">

                    {property.features.map(
                      (
                        feature,
                        index
                      ) => (
                        <span
                          key={`${feature}-${index}`}
                        >
                          {feature}
                        </span>
                      )
                    )}

                  </div>

                ) : (

                  <p className="property-no-data">
                    No features added.
                  </p>

                )}

              </section>

            </div>


            {/* =================================
                RIGHT COLUMN
            ================================= */}

            <aside className="property-details-sidebar">


              {/* =================================
                  PRICE
              ================================= */}

              <section className="property-price-card">

                <span>
                  PRICE
                </span>

                <strong>
                  {formatPrice()}
                </strong>

                <small>
                  {property.price
                    ?.currency ||
                    "PKR"}
                </small>

              </section>


              {/* =================================
                  STATUS
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Property Status
                    </h2>

                  </div>

                </div>


                <div className="status-information">

                  <div>

                    <span>
                      Listing Status
                    </span>

                    <strong
                      className={getStatusClass(
                        property.status
                      )}
                    >
                      {property.status ||
                        "draft"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Verification
                    </span>

                    <strong
                      className={
                        "verification-" +
                        (
                          property.verificationStatus ||
                          "pending"
                        )
                      }
                    >
                      {property.verificationStatus ||
                        "pending"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Featured
                    </span>

                    <strong>
                      {property.isFeatured
                        ? "Yes"
                        : "No"}
                    </strong>

                  </div>

                </div>

              </section>


              {/* =================================
                  DATES
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Record
                    </h2>

                  </div>

                </div>


                <div className="record-information">

                  <div>

                    <span>
                      Created
                    </span>

                    <strong>
                      {formatDate(
                        property.createdAt
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Last Updated
                    </span>

                    <strong>
                      {formatDate(
                        property.updatedAt
                      )}
                    </strong>

                  </div>

                </div>

              </section>


              {/* =================================
                  QUICK ACTIONS
              ================================= */}

              <section className="property-details-card">

                <div className="property-card-header">

                  <div>

                    <h2>
                      Quick Actions
                    </h2>

                  </div>

                </div>


                <div className="quick-actions">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/properties/${property._id}/edit`
                      )
                    }
                  >
                    Edit Property
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/properties"
                      )
                    }
                  >
                    Property List
                  </button>

                </div>

              </section>

            </aside>

          </div>

        </main>

      </div>

    </div>
  );
};

export default ViewProperty;