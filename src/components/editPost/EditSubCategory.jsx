import React from "react";
import { useTranslation } from "react-i18next";

export const EditSubCategory = ({
  subCategoryList,
  imagePath,
  handleChooseSubCategory,
  postDetailData,
}) => {
  const { i18n } = useTranslation();

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
            <h3 className="text-center pt-4 font-bold text-xl">
              {i18n.language === "en" ? item.name : item.arabic_name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
