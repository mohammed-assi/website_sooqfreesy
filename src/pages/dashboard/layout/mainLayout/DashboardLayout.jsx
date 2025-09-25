import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../../../../layout/footer";
import { Header } from "../../../../layout/header";
import { DashboardHeader } from "../header";
import Sidebar from "../sidebar";

export const DashboardLayout = () => {
  return (
    <>
      <div className="sticky top-0 left-0 w-full z-50">
        <Header className="lg:!max-w-[calc(100%_-_100px)]" />
        <DashboardHeader />
      </div>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 lg:p-6 py-6 px-3 min-h-screen">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};
