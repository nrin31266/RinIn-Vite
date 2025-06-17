import React from "react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import WebSocketProvider from "../../features/ws/WebSocketProvider";
import { useAppSelector } from "../../store/store";
import PostCreatorModal from "../PostCreatorModal/PostCreatorModal";

const AppLayout = () => {
  const { isOpen} = useAppSelector((state) => state.postCreator);

  return (
    <WebSocketProvider>
      <div className="bg-[var(--background-color)] grid grid-rows-[auto_1fr] min-h-screen">
        <HeaderComponent />
        <div className="container mx-auto md:px-0 pt-2">
          <Outlet />
          {isOpen && <PostCreatorModal />}
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default AppLayout;
