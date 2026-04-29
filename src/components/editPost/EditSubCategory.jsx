import React from "react";

export const EditSubCategory = ({
  subCategoryList,
  imagePath,
  handleChooseSubCategory,
  postDetailData,
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
            <div
              className={`p-3 border rounded-lg h-60 ${
                postDetailData?.sub_category_id === item.id
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              <img
                src={`${imagePath}/${item.image_url}`}
                alt={item.name}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-center pt-4 font-bold text-xl">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
