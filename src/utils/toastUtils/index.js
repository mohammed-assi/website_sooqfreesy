import { toast } from "react-toastify";
import i18n from "../../i18n";

const defaultOptions = () => ({
  position: i18n.language === "ar" ? "top-left" : "top-right",
  autoClose: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  closeButton: true,
});

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, { ...defaultOptions(), ...options });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, { ...defaultOptions(), ...options });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, { ...defaultOptions(), ...options });
};
