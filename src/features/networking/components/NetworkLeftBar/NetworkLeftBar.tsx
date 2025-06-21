import Divider from "@mui/material/Divider";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchConnections, fetchInvitations } from "../../../../store/networkingSlide";

const NetworkLeftBar = () => {
  const { connections, invitations, error, status } = useAppSelector(
    (state) => state.networking
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchConnections());
    dispatch(fetchInvitations());
  }, [dispatch, user?.id]);

  return (
    <div className="bg-white rounded-md border-1 border-gray-200 px-2 py-4 flex flex-col gap-4">
      <h1 className="text-md font-bold text-gray-800">Manage my network</h1>
      <Divider />
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/networking/invitations"
          className={({ isActive }) =>
            (isActive ? "text-[var(--primary-color)]" : "text-gray-500") +
            " flex justify-between"
          }
        >
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M15 13.25V21H9v-7.75A2.25 2.25 0 0 1 11.25 11h1.5A2.25 2.25 0 0 1 15 13.25m5-.25h-1a2 2 0 0 0-2 2v6h5v-6a2 2 0 0 0-2-2M12 3a3 3 0 1 0 3 3 3 3 0 0 0-3-3m7.5 8A2.5 2.5 0 1 0 17 8.5a2.5 2.5 0 0 0 2.5 2.5M5 13H4a2 2 0 0 0-2 2v6h5v-6a2 2 0 0 0-2-2m-.5-7A2.5 2.5 0 1 0 7 8.5 2.5 2.5 0 0 0 4.5 6"></path>
            </svg>
            Invitations
          </div>
          <div>
            <div className=" text-sm font-bold bg-gray-200 rounded-full w-[2rem] h-[2rem] flex items-center justify-center">
                {invitations.length}
                
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/networking/connections"
          className={({ isActive }) =>
            (isActive ? "text-[var(--primary-color)]" : "text-gray-500") +
            " justify-between flex"
          }
        >
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              focusable="false"
              width="24"
              height="24"
            >
              <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
              Add commentMore actions
            </svg>
            Connections
          </div>
          <div className=" text-sm font-bold bg-gray-200 rounded-full w-[2rem] h-[2rem] flex items-center justify-center">
            {connections.length}
          </div>
        </NavLink>
      </nav>
    </div>
  );
};

export default NetworkLeftBar;
