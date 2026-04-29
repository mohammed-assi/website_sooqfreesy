import React from "react";

export const ChooseSubCategory = ({
  subCategoryList,
  imagePath,
  handleChooseSubCategory,
}) => {

  return (
    <div className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subCategoryList.map((item, i) => (
          <div
            key={i}
            onClick={() => handleChooseSubCategory(item.id)}
            className="cursor-pointer"
          >
            <div className="p-3 border border-gray-200 rounded-lg h-60">
              <img
                src={`${imagePath}/${item.image_url}`}
                alt={item.name}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-center pt-4 font-bold text-xl">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
