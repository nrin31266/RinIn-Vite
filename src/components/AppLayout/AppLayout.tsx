import React from "react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import WebSocketProvider from "../../features/ws/WebSocketProvider";

const AppLayout = () => {
  return (
    <WebSocketProvider>
      <div className="bg-[var(--background-color)] grid grid-rows-[auto_1fr] min-h-screen">
        <HeaderComponent />
        <div className="container mx-auto md:px-0 pt-2">
          <Outlet />
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default AppLayout;
