import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`flex items-center px-3 py-2 rounded-lg border ${
          hasPrev
            ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <FaChevronLeft className="mr-1" size={12} />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-2 rounded-lg border min-w-[40px] ${
              page === currentPage
                ? "bg-blue-500 border-blue-500 text-white"
                : page === "..."
                ? "bg-transparent border-transparent text-gray-400 cursor-default"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`flex items-center px-3 py-2 rounded-lg border ${
          hasNext
            ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
        <FaChevronRight className="ml-1" size={12} />
      </button>
    </div>
  );
}
