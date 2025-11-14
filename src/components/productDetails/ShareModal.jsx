import { useTranslation } from "react-i18next";
import facebook from "../../assets/Social/facebook.svg";
import instagram from "../../assets/Social/Instagram.svg";
import whatsapp from "../../assets/Social/whatsapp.svg";
import { Link } from "react-router-dom";

export const ShareModal = ({
  onClose,
  shareLink,
  title,
  description,
  price,
  currency,
}) => {
  const { i18n, t } = useTranslation();
  // const encodedUrl = encodeURIComponent(shareLink);

  // const shareLinks = {
  //   whatsapp: `https://wa.me/?text=${encodedUrl}`,
  //   instagram: `https://www.instagram.com/`,
  //   facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  // };

  const message = `${title}
${description}
${t("price")}: ${currency === "SYP" ? "SYP" : "$"} ${price}
${shareLink}`;

  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(shareLink);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(
      `${title} - ${description} | ${t("price")}: ${price}`
    )}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`,
  };

  const shareApps = [
    { name: "Whatsapp", icon: whatsapp, link: shareLinks.whatsapp },
    { name: "Instagram", icon: instagram, link: shareLinks.instagram },
    { name: "Facebook", icon: facebook, link: shareLinks.facebook },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className={`${
            i18n.language === "ar" ? "left-6" : "right-6 "
          } absolute top-4 text-gray-400 hover:text-gray-600`}
        >
          <i className="fa-solid fa-xmark fa-lg" />
        </button>

        <h2 className="text-xl font-bold mb-4">{t("shareProduct")}</h2>

        <div className="grid grid-cols-3 gap-3 text-sm pt-4">
          {shareApps.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <div className="h-15 w-15">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="pt-2">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
