export const ChooseCategory = ({
  categoryList,
  handleChooseCategory,
  imagePath,
}) => {
  return (
    <div className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryList.map((item, i) => (
          <div
            key={i}
            onClick={() => handleChooseCategory(item)}
            className="cursor-pointer"
          >
            <div className="p-3 border border-gray-200 rounded-lg h-60">
              <img
                src={`${imagePath}/${item.image_url}`}
                alt={item.name}
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <h3 className="text-center pt-4 font-bold text-xl">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
