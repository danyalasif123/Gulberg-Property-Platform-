import "./PropertyOverview.css";

const PropertyOverview = ({ property }) => {
  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    if (typeof price === "number") {
      return `PKR ${price.toLocaleString("en-PK")}`;
    }

    if (typeof price === "string") {
      const number = Number(price);

      if (!Number.isNaN(number)) {
        return `PKR ${number.toLocaleString("en-PK")}`;
      }

      return price;
    }

    if (typeof price === "object") {
      const value =
        price.value ??
        price.amount ??
        price.price;

      const currency =
        price.unit ??
        price.currency ??
        "PKR";

      if (
        value === undefined ||
        value === null
      ) {
        return "Price on request";
      }

      return `${currency} ${Number(
        value
      ).toLocaleString("en-PK")}`;
    }

    return "Price on request";
  };


  const getLocation = () => {
    const society =
      typeof property.society === "object"
        ? property.society?.name
        : property.society;

    const block =
      typeof property.block === "object"
        ? property.block?.name
        : property.block;

    return [society, block]
      .filter(Boolean)
      .join(" · ");
  };


  return (
    <section className="property-overview">

      {/* =================================
          TYPE / PURPOSE
      ================================= */}

      <div className="property-overview-tags">

        {property.propertyType && (
          <span className="property-tag">
            {property.propertyType}
          </span>
        )}

        {property.purpose && (
          <span className="property-tag property-tag-purpose">
            {property.purpose}
          </span>
        )}

      </div>


      {/* =================================
          TITLE
      ================================= */}

      <h1 className="property-overview-title">
        {property.title ||
          "Untitled Property"}
      </h1>


      {/* =================================
          PRICE
      ================================= */}

      <div className="property-overview-price">
        {formatPrice(property.price)}
      </div>


      {/* =================================
          LOCATION
      ================================= */}

      {getLocation() && (
        <div className="property-overview-location">

          <span className="property-location-dot">
            ●
          </span>

          <span>
            {getLocation()}
          </span>

        </div>
      )}


      {/* =================================
          DESCRIPTION
      ================================= */}

      {property.description && (
        <div className="property-description">

          <span className="property-description-label">
            DESCRIPTION
          </span>

          <p>
            {property.description}
          </p>

        </div>
      )}

    </section>
  );
};

export default PropertyOverview;