export default function AdminPagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const page = Number(meta.page || 1);
  const totalPages = Number(meta.totalPages || 1);

  return (
    <div className="adminPagination">
      <button type="button" className="adminPaginationButton interactive" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        type="button"
        className="adminPaginationButton interactive"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
