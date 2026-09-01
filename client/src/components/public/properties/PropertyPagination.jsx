import "./PropertyPagination.css";

const PropertyPagination = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const pages = [];

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="property-pagination">

      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="pagination-arrow"
      >
        ←
      </button>

      <div className="pagination-pages">

        {pages.map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            className={
              pageNumber === page
                ? "pagination-page active"
                : "pagination-page"
            }
            onClick={() =>
              onPageChange(
                pageNumber
              )
            }
          >
            {pageNumber}
          </button>
        ))}

      </div>

      <button
        type="button"
        disabled={
          page === totalPages
        }
        onClick={() =>
          onPageChange(page + 1)
        }
        className="pagination-arrow"
      >
        →
      </button>

    </div>
  );
};

export default PropertyPagination;