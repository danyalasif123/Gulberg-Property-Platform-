import { Link } from "react-router-dom";

const PropertyHeader = () => {
  return (
    <div className="properties-header">

      <div>
        <h2>Properties</h2>

        <p>
          Manage your property listings
        </p>
      </div>

      <Link
        to="/admin/properties/add"
        className="add-property-button"
      >
        + Add Property
      </Link>

    </div>
  );
};

export default PropertyHeader;