import { useNavigate } from "react-router-dom";

import "./PropertyListCard.css";

const PropertyListCard = ({ property }) => {
  const navigate = useNavigate();

  /*
  =========================================
  IMAGE
  =========================================
  */

  const getImage = () => {
    if (!property?.images?.length) {
      return "/placeholder-property.jpg";
    }

    const firstImage = property.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (typeof firstImage === "object") {
      return (
        firstImage.url ||
        firstImage.secure_url ||
        firstImage.path ||
        "/placeholder-property.jpg"
      );
    }

    return "/placeholder-property.jpg";
  };


  /*
  =========================================
  PRICE
  =========================================
  */

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    /*
    NUMBER
    Example:
    25000000
    */

    if (typeof price === "number") {
      return `PKR ${price.toLocaleString("en-PK")}`;
    }


    /*
    STRING
    Example:
    "25000000"
    */

    if (typeof price === "string") {
      const numericPrice =
        Number(price);

      if (!Number.isNaN(numericPrice)) {
        return `PKR ${numericPrice.toLocaleString(
          "en-PK"
        )}`;
      }

      return price;
    }


    /*
    OBJECT
    Example:
    {
      value: 25000000,
      unit: "PKR"
    }
    */

    if (
      typeof price === "object"
    ) {

      const value =
        price.value ??
        price.amount ??
        price.price ??
        price.number;

      const unit =
        price.unit ??
        price.currency ??
        price.currencyCode ??
        "PKR";

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "Price on request";
      }

      const numericValue =
        Number(value);

      if (!Number.isNaN(numericValue)) {
        return `${unit} ${numericValue.toLocaleString(
          "en-PK"
        )}`;
      }

      return `${unit} ${value}`;
    }

    return "Price on request";
  };


  /*
  =========================================
  LOCATION
  =========================================
  */

  const getSocietyName = () => {
    if (!property?.society) {
      return "";
    }

    if (
      typeof property.society ===
      "object"
    ) {
      return (
        property.society.name ||
        ""
      );
    }

    return property.society;
  };


  const getBlockName = () => {
    if (!property?.block) {
      return "";
    }

    if (
      typeof property.block ===
      "object"
    ) {
      return (
        property.block.name ||
        ""
      );
    }

    return property.block;
  };


  /*
  =========================================
  SIZE
  =========================================
  */

  const getSize = () => {
    if (!property?.size) {
      return null;
    }

    if (
      typeof property.size ===
      "object"
    ) {
      const value =
        property.size.value ??
        property.size.amount;

      const unit =
        property.size.unit || "";

      if (
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return `${value} ${unit}`;
    }

    return String(
      property.size
    );
  };


  const society =
    getSocietyName();

  const block =
    getBlockName();

  const size =
    getSize();


  /*
  =========================================
  RENDER
  =========================================
  */

  return (
    <article
      className="property-list-card"
    >

      {/* =================================
          IMAGE
      ================================= */}

      <div className="property-list-image-wrapper">

        <img
          src={getImage()}
          alt={
            property.title ||
            "Property"
          }
          className="property-list-image"
        />

        <div className="property-list-overlay" />


        {property.purpose && (
          <span className="property-list-purpose">
            {property.purpose}
          </span>
        )}

      </div>


      {/* =================================
          CONTENT
      ================================= */}

      <div className="property-list-content">

        {/* TOP */}

        <div className="property-list-top">

          <span className="property-list-type">
            {property.propertyType ||
              "Property"}
          </span>

          <span className="property-list-category">

            {typeof property.category ===
            "object"
              ? property.category?.name
              : property.category}

          </span>

        </div>


        {/* TITLE */}

        <h3 className="property-list-title">

          {property.title ||
            "Untitled Property"}

        </h3>


        {/* LOCATION */}

        {(society || block) && (
          <div className="property-list-location">

            <span className="location-icon">
              ●
            </span>

            <span>

              {society}

              {society && block
                ? " · "
                : ""}

              {block}

            </span>

          </div>
        )}


        {/* DETAILS */}

        <div className="property-list-details">

          {size && (
            <span>
              {size}
            </span>
          )}

          {property.bedrooms !==
            undefined &&
            property.bedrooms !==
              null && (
              <span>
                {property.bedrooms} Beds
              </span>
            )}

          {property.bathrooms !==
            undefined &&
            property.bathrooms !==
              null && (
              <span>
                {property.bathrooms} Baths
              </span>
            )}

        </div>


        {/* =================================
            PRICE + BUTTON
        ================================= */}

        <div className="property-list-bottom">

          <strong className="property-list-price">

            {formatPrice(
              property.price
            )}

          </strong>


          <button
            type="button"
            className="property-list-button"
            onClick={() =>
              navigate(
                `/properties/${property._id}`
              )
            }
          >
            View Property
          </button>

        </div>

      </div>

    </article>
  );
};

export default PropertyListCard;