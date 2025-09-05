import { useLocation } from "react-router-dom";
import { Router } from "./routes/Routes";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    NProgress.configure({
      showSpinner: false,
    });
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  return (
    <>
      <Router />
      <ToastContainer />
    </>
  );
}

export default App;
