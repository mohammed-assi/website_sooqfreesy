// import axios from "axios";
// import NProgress from "nprogress";
// import { LOCAL_STORAGE } from "../constants";
// import i18n from "../../i18n";

// let controller = null;

// axios.interceptors.request.use((config) => {
//   NProgress.start();
//   return config;
// });

// axios.interceptors.response.use(
//   (response) => {
//     NProgress.done();
//     return response;
//   },
//   (error) => {
//     NProgress.done();
//     return Promise.reject(error);
//   }
// );

// export function cancelRequest() {
//   if (controller) {
//     controller.abort();
//     controller = null;
//   }
// }

// export async function apiRequest(
//   endPoint,
//   data = {},
//   method = "get",
//   customHeaders = {}
// ) {
//   return new Promise(async (resolve, reject) => {
//     cancelRequest();
//     controller = new AbortController();
//     const signal = controller.signal;
//     const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);

//     const headers = {
//       Accept: "application/json",
//        "Accept-Language": i18n.language || "en",
//       ...customHeaders,
//     };

//     if (data instanceof FormData) {
//       headers["Content-Type"] = "multipart/form-data";
//     } else {
//       headers["Content-Type"] = "application/json";
//     }

//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     try {
//       const response = await axios({
//         method,
//         url: endPoint,
//         headers,
//         data,
//         signal,
//       });
//       resolve(response);
//     } catch (error) {
//       if (error.name === "CanceledError" || axios.isCancel(error)) {
//         reject(new Error("Request canceled by user"));
//       } else {
//         reject(error);
//       }
//     }
//   });
// }

// export function getRequest(URL, headers = {}) {
//   return apiRequest(URL, {}, "get", headers);
// }

// export function postRequest(URL, payload, headers = {}) {
//   return apiRequest(URL, payload, "post", headers);
// }

// export function putRequest(URL, payload, headers = {}) {
//   return apiRequest(URL, payload, "put", headers);
// }

// export function patchRequest(URL, payload, headers = {}) {
//   return apiRequest(URL, payload, "patch", headers);
// }

// export function deleteRequest(URL, payload = {}, headers = {}) {
//   return apiRequest(URL, payload, "delete", headers);
// }

import axios from "axios";
import NProgress from "nprogress";
import { LOCAL_STORAGE } from "../constants";
import i18n from "../../i18n";
import { logout } from "../../redux/slices/authSlice";
import { clearUser } from "../../redux/slices/userSlice";
import { ROUTE } from "../../config/constants";

let controller = null;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "",
});

apiClient.interceptors.request.use((config) => {
  NProgress.start();

  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  const currency = localStorage.getItem(LOCAL_STORAGE.CURRENCY);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  config.headers["Accept"] = "application/json";
  config.headers["Accept-Language"] = i18n.language || "en";

  if (currency) {
    config.headers["currency-type"] = currency;
  }

  // if (fcmToken) {
  //   config.headers["fcm_token"] = fcmToken;
  //   config.headers["device_type"] = "web_app";
  // }

  return config;
});

export const setupAxiosInterceptors = (
  dispatch,
  navigate,
  setShowSessionModal
) => {
  apiClient.interceptors.response.use(
    (response) => {
      NProgress.done();
      return response;
    },
    (error) => {
      NProgress.done();

      if (error.response?.status === 401) {
        dispatch(logout());
        dispatch(clearUser());
        setShowSessionModal(true);

        if (window.location.pathname !== ROUTE.ROOT) {
          navigate(ROUTE.ROOT, { replace: true });
        }
      }

      return Promise.reject(error);
    }
  );
};

export function cancelRequest() {
  if (controller) {
    controller.abort();
    controller = null;
  }
}

export async function apiRequest(
  endPoint,
  data = {},
  method = "get",
  customHeaders = {}
) {
  return new Promise(async (resolve, reject) => {
    controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await apiClient({
        method,
        url: endPoint,
        headers: customHeaders,
        data,
        signal,
      });
      resolve(response);
    } catch (error) {
      if (error.name === "CanceledError") {
        reject(new Error("Request canceled by user"));
      } else {
        reject(error);
      }
    }
  });
}

export const getRequest = (URL, headers = {}) =>
  apiRequest(URL, {}, "get", headers);
export const postRequest = (URL, payload, headers = {}) =>
  apiRequest(URL, payload, "post", headers);
export const putRequest = (URL, payload, headers = {}) =>
  apiRequest(URL, payload, "put", headers);
export const patchRequest = (URL, payload, headers = {}) =>
  apiRequest(URL, payload, "patch", headers);
export const deleteRequest = (URL, payload = {}, headers = {}) =>
  apiRequest(URL, payload, "delete", headers);
