import React from 'react';

function Pagination({ page, hasNext, onPrev, onNext }) {
  return (
    <div className="flex justify-between mt-4">
      <button
        className="bg-blue-600 text-white px-8 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPrev}
        disabled={page === 1}
      >
        Previous
      </button>
      <button
        className="bg-blue-600 text-white px-8 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
