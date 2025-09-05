import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  closeButton: true,
};

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};
