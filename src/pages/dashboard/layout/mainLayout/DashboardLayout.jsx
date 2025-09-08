import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../../../../layout/footer";
import { Header } from "../../../../layout/header";
import { DashboardHeader } from "../header";
import Sidebar from "../sidebar";

export const DashboardLayout = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
        <DashboardHeader />
      </div>
      <div className="pt-[120px] flex">
        <Sidebar />

        <div className="flex-1 p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};
