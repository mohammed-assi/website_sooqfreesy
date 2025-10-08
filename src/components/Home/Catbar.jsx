import React, { useMemo } from "react";
import estate from "../../assets/icon/estate.svg";
import vehicle from "../../assets/icon/vehicle.svg";
import other from "../../assets/icon/other.svg";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../config/constants";

const Catbar = ({ allCategory }) => {
  const navigate = useNavigate();
  const iconMap = {
    13: estate,
    3: vehicle,
    2: other,
  };

  const allowedCategoryIds = [13, 3, 2];

  const categories = useMemo(() => {
    if (!allCategory?.length) return [];

    return allCategory
      .filter((cat) => allowedCategoryIds.includes(cat.id))
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: iconMap[cat.id] || other,
        categoryName: cat.name,
      }));
  }, [allCategory]);

  return (
    <div className="grid grid-cols-3 py-2 sticky top-[117px] bg-white z-20 border-b border-gray-100 md:hidden">
      {categories.map((category) => (
        <button
          onClick={() => {
            navigate(ROUTE.PRODUCT_PAGE, {
              state: { categoryName: category?.categoryName },
            });
          }}
          key={category.id}
          className="flex justify-center items-center gap-2 not-last:border-r not-last:border-gray-200"
        >
          <img
            src={category.icon}
            alt={category.name}
            className="size-8 group-hover:scale-110 transition"
          />
          <p className="text-xs">{category.name}</p>
        </button>
      ))}
    </div>
  );
};

export default Catbar;
