import styles from './Paginacion.module.css';

export default function Pagination({ totalPages, currentPage, setCurrentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={styles.arrowButton}
      >
        &larr; {/* Flecha izquierda */}
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={currentPage === number ? styles.active : ''}
        >
          {number}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={styles.arrowButton}
      >
        &rarr; {/* Flecha derecha */}
      </button>
    </div>
  );
}