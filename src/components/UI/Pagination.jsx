import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    return (
        <div className="pagination flex space-between">
            <div className="flex gap-8">
                <div className="bold-text">Page</div>
                <div>{currentPage}/{totalPages}</div>
            </div>
            <div className="flex gap-8">
                {/* Previous button */}
                <button
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {"Previous"}
                </button>
                {/* Page numbers */}
                {Array.from({ length: totalPages > 3 ? 3 : totalPages }, (_, i) => (
                    <button
                        key={`page-${i + 1}`}
                        className={`pagination-btn ${currentPage === i + 1 ? 'bg-green text-white' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                {/* Ellipsis */}
                {totalPages > 3 && <span>...</span>}
                {/* Next button */}
                <button
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {"Next"}
                </button>
            </div>
        </div>
    );
};

export default Pagination;
