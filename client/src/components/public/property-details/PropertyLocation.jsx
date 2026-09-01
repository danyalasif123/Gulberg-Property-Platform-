import "./PropertyLocation.css";

const PropertyLocation = ({
  property,
}) => {
  const getName = (location) => {
    if (!location) {
      return "";
    }

    if (
      typeof location === "object"
    ) {
      return location.name || "";
    }

    return location;
  };


  const society =
    getName(property.society);

  const block =
    getName(property.block);


  if (!society && !block) {
    return null;
  }


  return (
    <section className="property-location">

      <div className="property-location-box">

        <div className="property-location-icon">
          G
        </div>

        <div className="property-location-content">

          <strong>
            {society || "Gulberg"}
          </strong>

          {block && (
            <span>
              {block}
            </span>
          )}

        </div>

      </div>

    </section>
  );
};

export default PropertyLocation;