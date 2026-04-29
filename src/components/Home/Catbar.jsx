import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../config/constants";

const Catbar = ({ allCategory, imagePath }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 py-2 sticky top-[117px] bg-white z-20 border-b border-gray-100 md:hidden">
      {allCategory?.map((category) => (
        <button
          onClick={() => {
            navigate(ROUTE.PRODUCT_PAGE, {
              state: {  categoryName: category?.name,  categoryId : category?.id  },
            });
          }}
          key={category.id}
          className="flex justify-center items-center gap-2 not-last:border-r not-last:border-gray-200"
        >
          <img
            src={`${imagePath}/${category?.image_url}`}
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
