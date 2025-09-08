import React from "react";
import defaultUser from "../../assets/icon/defaultUser.svg";
import RatingStar from "../../common/ratingStar/RatingStar";
import { useTranslation } from "react-i18next";

export const SellerReviews = () => {
  const { t } = useTranslation();
  const reviews = [
    {
      image: defaultUser,
      name: "James",
      review:
        "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin. Sit scelerisque cras donec magna dictum. Pharetra nibh tellus elementum convallis turpis urna dapibus turpis. Faucibus arcu laoreet faucibus libero. Volutpat suspendisse egestas mi id nullam imperdiet nunc. Amet risus enim eu vulputate sit mauris lacus velit magnis. Sed sapien ornare sit in.",
    },
    {
      image: defaultUser,
      name: "Bond",
      review:
        "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin. Sit scelerisque cras donec magna dictum. Pharetra nibh tellus elementum convallis turpis urna dapibus turpis. Faucibus arcu laoreet faucibus libero. Volutpat suspendisse egestas mi id nullam imperdiet nunc. Amet risus enim eu vulputate sit mauris lacus velit magnis. Sed sapien ornare sit in.",
    },
    {
      image: defaultUser,
      name: "Kakashi",
      review:
        "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin. Sit scelerisque cras donec magna dictum. Pharetra nibh tellus elementum convallis turpis urna dapibus turpis. Faucibus arcu laoreet faucibus libero. Volutpat suspendisse egestas mi id nullam imperdiet nunc. Amet risus enim eu vulputate sit mauris lacus velit magnis. Sed sapien ornare sit in.",
    },
  ];
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2 capitalize">{t('reviews')}</h2>
      {reviews?.map((item, i) => (
        <div key={i} className="py-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt="userImg"
                className="h-15 w-15 object-cover rounded-full"
              />
              <h4 className="font-semibold text-lg">{item.name}</h4>
            </div>
            <RatingStar starValue={4.5} />
          </div>
          <p className="text-gray-500 py-2">{item.review}</p>
        </div>
      ))}
    </div>
  );
};
