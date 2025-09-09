export const BASEURL = import.meta.env.VITE_APP_API_URL;
const AUTH_PREFIX = "/auth/customer";
const PREFIX = "/auth";

export const AUTH = {
  LOGIN_USERNAME: `${BASEURL}${AUTH_PREFIX}/login`,
  LOGIN_PHONE: `${BASEURL}${AUTH_PREFIX}/login-phone`,
  LOGIN_PHONE_VERIFY: `${BASEURL}${AUTH_PREFIX}/login-phone-verify`,

  SIGNUP_USERNAME: `${BASEURL}${AUTH_PREFIX}/register`,
  SIGNUP_USERNAME_VERIFY: `${BASEURL}${AUTH_PREFIX}/otp-verify`,
  SIGNUP_PHONE: `${BASEURL}${AUTH_PREFIX}/register-phone`,
  SIGNUP_PHONE_VERIFY: `${BASEURL}${AUTH_PREFIX}/register-phone-verify`,

  CHECK_USERNAME: `${BASEURL}${AUTH_PREFIX}/check-username`,

  GET_PROFILE: `${BASEURL}${AUTH_PREFIX}/profile`,

  FORGOT_PASSWORD: `${BASEURL}${PREFIX}/forgot-password`,
  RESET_PASSWORD: `${BASEURL}${PREFIX}/reset-password`,
  RESEND_OTP: `${BASEURL}${PREFIX}/resend-otp`,
};

export const CUSTOMER = {
  CONTACT_US: `${BASEURL}/customer/contact-issue/create`,
  UPDATE_PROFILE_PIC: `${BASEURL}/customer/update-profile-picture`,
  UPDATE_PASSWORD: `${BASEURL}/customer/change-password`,
  UPDATE_PROFILE_INFO: `${BASEURL}/customer/update-custom-profile`,
  SEND_OTP: `${BASEURL}/customer/send-verification-otp`,
  VERIFY_OTP: `${BASEURL}/customer/verify-customer-otp`,
};

export const REPORT_LIST = {
  CONTACT_US: `${BASEURL}/report/report-listing`,
};
