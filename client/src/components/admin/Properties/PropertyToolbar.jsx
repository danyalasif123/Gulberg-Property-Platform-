const PropertyToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  onSearch,
  onClear,
}) => {
  return (
    <div className="properties-toolbar">

      <form
        className="property-search"
        onSubmit={onSearch}
      >
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
        }}
      >
        <option value="">
          All Statuses
        </option>

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

      <button
        className="clear-filter-button"
        onClick={onClear}
      >
        Clear
      </button>

    </div>
  );
};

export default PropertyToolbar;