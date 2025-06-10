import React from "react";
import NetworkLeftBar from "../../components/NetworkLeftBar/NetworkLeftBar";
import { Outlet } from "react-router-dom";
import SuggestionsNetwork from "../../components/SuggestionsNetwork/SuggestionsNetwork";

const Networking = () => {
  return (
    <div className="grid grid-rows-[auto_auto] md:grid-cols-[14rem_1fr] px-1 lg:px-2 gap-4 xl:grid-cols-[14rem_1fr_20rem] ">
      <div className="">
        <NetworkLeftBar />
      </div>
      <div className="flex flex-col gap-4">
        <Outlet />
        <SuggestionsNetwork />
      </div>
      <div className={`bg-blue-500 xl:block hidden`}>3</div>
    </div>
  );
};

export default Networking;
