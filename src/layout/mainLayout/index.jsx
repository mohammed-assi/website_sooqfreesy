import React from "react";
import { Header } from "../header";
import { Footer } from "../footer";
import { Outlet } from "react-router-dom";
import { WebHead } from "../webHead";

export const MainLayout = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
        <WebHead />
      </div>
      <div className="pt-[110px]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
