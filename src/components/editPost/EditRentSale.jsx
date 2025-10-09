// import React from "react";
// import { useTranslation } from "react-i18next";

// export const EditRentSale = ({
//   categoryData,
//   imagePath,
//   handleChooseRentSale,
//   postDetailData,
// }) => {
//   const { t } = useTranslation();

//   console.log("postDetailData", postDetailData?.post_type);
//   return (
//     <div className="py-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div onClick={() => handleChooseRentSale(1)} className="cursor-pointer">
//           <div className="p-3 border border-gray-200 rounded-lg h-70">
//             <img
//               src={`${imagePath}/${categoryData.image_url}`}
//               alt={categoryData.name}
//               className="h-full w-full object-cover rounded-lg"
//             />
//           </div>
//           <h3 className="text-center pt-4 font-bold text-xl">
//             {categoryData.name} {t("forSale")}
//           </h3>
//         </div>
//         <div onClick={() => handleChooseRentSale(2)} className="cursor-pointer">
//           <div className="p-3 border border-gray-200 rounded-lg h-70">
//             <img
//               src={`${imagePath}/${categoryData.image_url}`}
//               alt={categoryData.name}
//               className="h-full w-full object-cover rounded-lg"
//             />
//           </div>
//           <h3 className="text-center pt-4 font-bold text-xl">
//             {categoryData.name} {t("forRent")}
//           </h3>
//         </div>
//       </div>
//     </div>
//   );
// };


import React from "react";
import { useTranslation } from "react-i18next";

const OptionCard = ({ onClick, imgSrc, alt, label, isActive }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <div
        className={`p-3 border rounded-lg h-70 transition 
          ${isActive ? "border-primary" : "border-gray-200"} hover:border-primary`}
      >
        <img
          src={imgSrc}
          alt={alt}
          className="h-full w-full object-contain rounded-lg"
        />
      </div>
      <h3 className="text-center pt-4 font-bold text-xl">{label}</h3>
    </div>
  );
};

export const EditRentSale = ({
  categoryData,
  imagePath,
  handleChooseRentSale,
  postDetailData,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      id: 1,
      label: `${categoryData.name} ${t("forSale")}`,
      activeKeys: ["sale", "forsale"], // normalize
    },
    {
      id: 2,
      label: `${categoryData.name} ${t("forRent")}`,
      activeKeys: ["rent", "forrent"], // normalize
    },
  ];

  return (
    <div className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            onClick={() => handleChooseRentSale(opt.id)}
            imgSrc={`${imagePath}/${categoryData.image_url}`}
            alt={categoryData.name}
            label={opt.label}
            isActive={opt.activeKeys.includes(
              postDetailData?.post_type?.toLowerCase()
            )}
          />
        ))}
      </div>
    </div>
  );
};
