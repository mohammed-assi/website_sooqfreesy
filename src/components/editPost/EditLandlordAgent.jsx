// import React from "react";
// import landlord from "../../assets/icon/landlord.svg";
// import agent from "../../assets/icon/agent.svg";
// import { useTranslation } from "react-i18next";

// export const EditLandlordAgent = ({
//   handleChooseLandlordAgent,
//   categoryData,
//   postDetailData
// }) => {
//   const { t } = useTranslation();

//   console.log("postDetailData", postDetailData?.user_type);
//   return (
//     <div className="py-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div
//           onClick={() => handleChooseLandlordAgent(1)}
//           className="cursor-pointer"
//         >
//           <div className="p-3 border-2 border-gray-200 rounded-lg h-70 flex flex-col justify-center items-center hover:border-primary transition">
//             <img src={landlord} alt="icon" className="h-20 w-20 rounded-lg" />
//             <h3 className="text-center pt-4 font-bold text-xl">
//               {categoryData?.name === "Real Estate"
//                 ? t("landlord")
//                 : t("owner")}
//             </h3>
//           </div>
//         </div>
//         <div
//           onClick={() => handleChooseLandlordAgent(2)}
//           className="cursor-pointer"
//         >
//           <div className="p-3 border-2 border-gray-200 rounded-lg h-70 flex flex-col justify-center items-center hover:border-primary transition">
//             <img src={agent} alt="icon" className="h-20 w-20 rounded-lg" />
//             <h3 className="text-center pt-4 font-bold text-xl">{t("agent")}</h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";
import landlord from "../../assets/icon/landlord.svg";
import agent from "../../assets/icon/agent.svg";
import { useTranslation } from "react-i18next";

const OptionCard = ({ onClick, imgSrc, label, isActive }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <div
        className={`p-3 border-2 rounded-lg h-70 flex flex-col justify-center items-center transition
          ${
            isActive ? "border-primary" : "border-gray-200"
          } hover:border-primary`}
      >
        <img src={imgSrc} alt="icon" className="h-20 w-20 rounded-lg" />
        <h3 className="text-center pt-4 font-bold text-xl">{label}</h3>
      </div>
    </div>
  );
};

export const EditLandlordAgent = ({
  handleChooseLandlordAgent,
  categoryData,
  postDetailData,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      id: 1,
      img: landlord,
      label: categoryData?.name === "Real Estate" ? t("landlord") : t("owner"),
      activeKeys: ["landlord", "owner"], // ✅ both count as active
    },
    {
      id: 2,
      img: agent,
      label: t("agent"),
      activeKeys: ["agent"],
    },
  ];

  return (
    <div className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            onClick={() => handleChooseLandlordAgent(opt.id)}
            imgSrc={opt.img}
            label={opt.label}
            isActive={opt.activeKeys.includes(
              postDetailData?.user_type?.toLowerCase()
            )}
          />
        ))}
      </div>
    </div>
  );
};
