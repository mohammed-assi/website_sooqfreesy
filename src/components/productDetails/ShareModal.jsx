import { useTranslation } from "react-i18next";
import facebook from "../../assets/Social/facebook.svg";
import instagram from "../../assets/Social/Instagram.svg";
import messages from "../../assets/Social/messages.svg";
import messanger from "../../assets/Social/messanger.svg";
import skype from "../../assets/Social/skype.svg";
import whatsapp from "../../assets/Social/whatsapp.svg";
import { Link } from "react-router-dom";

export const ShareModal = ({ onClose, shareLink }) => {
  const { t } = useTranslation();
  const encodedUrl = encodeURIComponent(shareLink);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    messenger: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_FACEBOOK_APP_ID&redirect_uri=${encodedUrl}`,
    skype: `https://web.skype.com/share?url=${encodedUrl}`,
    messages: `sms:?body=${encodedUrl}`,
    instagram: `https://www.instagram.com/`,
  };

  const shareApps = [
    { name: "Whatsapp", icon: whatsapp, link: shareLinks.whatsapp },
    { name: "Instagram", icon: instagram, link: shareLinks.instagram },
    { name: "Facebook", icon: facebook, link: shareLinks.facebook },
    { name: "Messages", icon: messages, link: shareLinks.messages },
    { name: "Skype", icon: skype, link: shareLinks.skype },
    { name: "Messenger", icon: messanger, link: shareLinks.messenger },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-600"
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
