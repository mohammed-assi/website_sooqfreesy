import React from "react";

export const ChooseRentSale = ({ categoryData, imagePath, handleChooseRentSale }) => {
  return (
    <div className="py-5">
      <div className="grid grid-cols-2 gap-6">
        <div
          onClick={() => handleChooseRentSale(1)}
          className="cursor-pointer"
        >
          <div className="p-3 border border-gray-200 rounded-lg h-70">
            <img
              src={`${imagePath}/${categoryData.image_url}`}
              alt={categoryData.name}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <h3 className="text-center pt-4 font-bold text-xl">For Sale</h3>
        </div>
        <div
          onClick={() => handleChooseRentSale(2)}
          className="cursor-pointer"
        >
          <div className="p-3 border border-gray-200 rounded-lg h-70">
            <img
              src={`${imagePath}/${categoryData.image_url}`}
              alt={categoryData.name}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <h3 className="text-center pt-4 font-bold text-xl">For Rent</h3>
        </div>
      </div>
    </div>
  );
};
