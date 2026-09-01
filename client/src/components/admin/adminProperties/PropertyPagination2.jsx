const PropertyPagination = ({
  page,
  pagination,
  setPage,
}) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">

      <button
        disabled={page === 1}
        onClick={() =>
          setPage((prev) => prev - 1)
        }
      >
        Previous
      </button>

      <span>
        Page {page} of{" "}
        {pagination.totalPages}
      </span>

      <button
        disabled={
          page >= pagination.totalPages
        }
        onClick={() =>
          setPage((prev) => prev + 1)
        }
      >
        Next
      </button>

    </div>
  );
};

export default PropertyPagination;