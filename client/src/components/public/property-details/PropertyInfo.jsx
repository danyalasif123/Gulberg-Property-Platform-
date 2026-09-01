import "./PropertyInfo.css";

const PropertyInfo = ({ property }) => {
  const getSize = () => {
    if (!property.size) {
      return null;
    }

    if (
      typeof property.size === "object"
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

    return property.size;
  };


  const details = [
    {
      label: "TYPE",
      value:
        property.propertyType || "—",
    },

    {
      label: "PURPOSE",
      value:
        property.purpose || "—",
    },

    {
      label: "SIZE",
      value:
        getSize() || "—",
    },

    {
      label: "BEDROOMS",
      value:
        property.bedrooms ??
        "—",
    },

    {
      label: "BATHROOMS",
      value:
        property.bathrooms ??
        "—",
    },

    {
      label: "STATUS",
      value:
        property.status || "—",
    },
  ];


  return (
    <section className="property-info">

      <div className="property-info-grid">

        {details.map((detail) => (
          <div
            className="property-info-item"
            key={detail.label}
          >

            <span>
              {detail.label}
            </span>

            <strong>
              {detail.value}
            </strong>

          </div>
        ))}

      </div>

    </section>
  );
};

export default PropertyInfo;