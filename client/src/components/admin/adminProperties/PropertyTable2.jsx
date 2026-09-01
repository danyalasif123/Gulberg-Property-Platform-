import PropertyRow from "./PropertyRow2";

const PropertyTable = ({
  properties,
  loading,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div className="properties-table-wrapper">

      <table className="properties-table">

        <thead>
          <tr>
            <th>Property</th>
            <th>Location</th>
            <th>Type</th>
            <th>Size</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td
                colSpan="7"
                className="table-message"
              >
                Loading properties...
              </td>
            </tr>
          ) : properties.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="table-message"
              >
                No properties found.
              </td>
            </tr>
          ) : (
            properties.map((property) => (
              <PropertyRow
                key={property._id}
                property={property}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))
          )}

        </tbody>

      </table>

    </div>
  );
};

export default PropertyTable;