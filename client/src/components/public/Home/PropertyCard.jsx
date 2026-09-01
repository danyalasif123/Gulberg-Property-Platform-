import { Link } from "react-router-dom";

import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  /*
   * =========================================
   * IMAGE
   * =========================================
   */

  const getPropertyImage = () => {
    if (
      !property?.images ||
      !Array.isArray(property.images) ||
      property.images.length === 0
    ) {
      return "";
    }

    const firstImage = property.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (typeof firstImage === "object") {
      return (
        firstImage.url ||
        firstImage.secure_url ||
        firstImage.src ||
        ""
      );
    }

    return "";
  };

  /*
   * =========================================
   * SIZE
   * =========================================
   */

  const formatSize = (size) => {
    if (
      size === undefined ||
      size === null ||
      size === ""
    ) {
      return null;
    }

    if (typeof size === "string") {
      return size;
    }

    if (typeof size === "number") {
      return String(size);
    }

    if (typeof size === "object") {
      const value = size.value;
      const unit = size.unit;

      if (
        value !== undefined &&
        value !== null &&
        unit
      ) {
        return `${value} ${unit}`;
      }

      if (
        value !== undefined &&
        value !== null
      ) {
        return String(value);
      }
    }

    return null;
  };

  /*
   * =========================================
   * PRICE
   * =========================================
   */

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "Price on request";
    }

    if (typeof price === "number") {
      return `PKR ${price.toLocaleString(
        "en-PK"
      )}`;
    }

    if (typeof price === "string") {
      const numericPrice = Number(
        price.replace(/,/g, "")
      );

      if (!Number.isNaN(numericPrice)) {
        return `PKR ${numericPrice.toLocaleString(
          "en-PK"
        )}`;
      }

      return `PKR ${price}`;
    }

    if (typeof price === "object") {
      const value =
        price.value ??
        price.amount ??
        price.price;

      if (
        value !== undefined &&
        value !== null
      ) {
        const numericValue = Number(
          String(value).replace(/,/g, "")
        );

        if (!Number.isNaN(numericValue)) {
          return `PKR ${numericValue.toLocaleString(
            "en-PK"
          )}`;
        }
      }

      return "Price on request";
    }

    return "Price on request";
  };

  /*
   * =========================================
   * PROPERTY TYPE
   * =========================================
   */

  const formatPropertyType = (type) => {
    if (!type) {
      return "Property";
    }

    return String(type)
      .replace(/[-_]/g, " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  /*
   * =========================================
   * PURPOSE
   * =========================================
   */

  const formatPurpose = (purpose) => {
    if (
      String(purpose).toLowerCase() ===
      "rent"
    ) {
      return "FOR RENT";
    }

    return "FOR SALE";
  };

  const image = getPropertyImage();

  const formattedSize = formatSize(
    property?.size
  );

  /*
   * =========================================
   * CARD
   * =========================================
   */

  return (
    <article className="property-card">

      {/* =================================
          IMAGE
      ================================= */}

      <Link
        to={`/properties/${property._id}`}
        className="property-image-link"
      >
        <div className="property-image">

          {image ? (
            <img
              src={image}
              alt={
                property.title ||
                "Property"
              }
            />
          ) : (
            <div className="no-property-image">
              <span>G</span>
            </div>
          )}

          <div className="property-image-overlay" />

          {/* Purpose */}

          <span className="property-badge">
            {formatPurpose(
              property.purpose
            )}
          </span>

          {/* Featured */}

          {property.isFeatured && (
            <span className="featured-badge">
              FEATURED
            </span>
          )}

        </div>
      </Link>

      {/* =================================
          CONTENT
      ================================= */}

      <div className="property-card-content">

        {/* Property Type */}

        <span className="property-type">
          {formatPropertyType(
            property.propertyType
          )}
        </span>

        {/* Title */}

        <h3>
          {property.title ||
            "Property"}
        </h3>

        {/* =================================
            LOCATION
        ================================= */}

        <div className="property-location">

          <span className="location-icon">
            ◇
          </span>

          <span>
            {property.society ||
              "Gulberg Islamabad"}

            {property.block &&
              ` • Block ${property.block}`}
          </span>

        </div>

        {/* =================================
            DETAILS
        ================================= */}

        {(formattedSize ||
          property.plotNumber) && (
          <div className="property-details">

            {formattedSize && (
              <span>
                <strong>
                  {formattedSize}
                </strong>

                <small>
                  SIZE
                </small>
              </span>
            )}

            {property.plotNumber && (
              <span>
                <strong>
                  {property.plotNumber}
                </strong>

                <small>
                  PLOT
                </small>
              </span>
            )}

          </div>
        )}

        {/* =================================
            FOOTER
        ================================= */}

        <div className="property-card-footer">

          <div className="property-price">
            {formatPrice(
              property.price
            )}
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="property-view-button"
          >
            View Property

            <span>
              →
            </span>
          </Link>

        </div>

      </div>

    </article>
  );
};

export default PropertyCard;