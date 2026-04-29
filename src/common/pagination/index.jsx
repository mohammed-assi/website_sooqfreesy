// import React from "react";

// const Pagination = ({ totalPages, currentPage, onPageChange }) => {
//   const getPages = () => {
//     const pages = [];

//     if (totalPages <= 3) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage === 1) {
//         pages.push(1, 2, 3);
//       } else if (currentPage === totalPages) {
//         pages.push(totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(currentPage - 1, currentPage, currentPage + 1);
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="flex justify-end items-center space-x-2 mt-5">
//       <button
//         onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white disabled:opacity-50"
//       >
//         <i className="fa-solid fa-chevron-left" />
//       </button>

//       {getPages().map((page, index) => (
//         <button
//           key={index}
//           onClick={() => onPageChange(page)}
//           className={`px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white ${
//             currentPage === page ? "bg-primary text-white" : "hover:bg-primary"
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       <button
//         onClick={() =>
//           currentPage < totalPages && onPageChange(currentPage + 1)
//         }
//         disabled={currentPage === totalPages}
//         className="font-bold px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white disabled:opacity-50"
//       >
//         <i className="fa-solid fa-chevron-right" />
//       </button>
//     </div>
//   );
// };

// export default Pagination;

import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const { t } = useTranslation();
  const getPages = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  return (
    <div className="mt-5 flex flex-col md:flex-row items-center justify-end gap-5">
      <span className="text-sm text-gray-600">
        {t('page')} <span className="font-semibold text-primary">{currentPage}</span>{" "}
        {t('of')} <span className="font-semibold">{totalPages}</span>
      </span>

      <div className="flex justify-end items-center space-x-2">
        {/* Total Pages Text */}

        {/* Prev Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white disabled:opacity-50"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        {/* Page Numbers */}
        {getPages().map((page, index) => (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white ${
              currentPage === page
                ? "bg-primary text-white"
                : "hover:bg-primary"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white disabled:opacity-50"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
