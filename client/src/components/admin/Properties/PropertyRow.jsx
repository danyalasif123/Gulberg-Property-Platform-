import { Link, useNavigate } from "react-router-dom";

const PropertyRow = ({
  property,
  onStatusChange,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <tr>

      {/* Property */}

      <td>
        <div className="property-title-cell">

          <strong>
            {property.title}
          </strong>

          <span>
            {property.propertyId}
          </span>

        </div>
      </td>

      {/* Location */}

      <td>
        <div className="location-cell">

          <strong>
            {property.society}
          </strong>

          <span>
            {property.block
              ? `Block ${property.block}`
              : "—"}

            {property.plotNumber
              ? ` • Plot ${property.plotNumber}`
              : ""}
          </span>

        </div>
      </td>

      {/* Type */}

      <td>
        <span className="type-text">
          {property.propertyType}
        </span>
      </td>

      {/* Size */}

      <td>
        {property.size?.value}{" "}
        {property.size?.unit}
      </td>

      {/* Price */}

      <td>
        <strong>
          {property.price?.currency}{" "}
          {property.price?.amount?.toLocaleString()}
        </strong>
      </td>

      {/* Status */}

      <td>

        <select
          className={`status-select status-${property.status}`}
          value={property.status}
          onChange={(e) =>
            onStatusChange(
              property._id,
              e.target.value
            )
          }
        >
          <option value="draft">
            Draft
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="published">
            Published
          </option>

          <option value="reserved">
            Reserved
          </option>

          <option value="sold">
            Sold
          </option>

          <option value="rejected">
            Rejected
          </option>

        </select>

      </td>

      {/* Actions */}

      <td>

        <div className="property-actions">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin/properties/${property._id}`
              )
            }
          >
            View
          </button>

          <Link
            to={`/admin/properties/${property._id}/edit`}
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() =>
              onDelete(property._id)
            }
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
};

export default PropertyRow;