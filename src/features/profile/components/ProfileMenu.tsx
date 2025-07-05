import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { IUser } from "../../../store/authSlice";

const ProfileMenu = ({ authenticatedUser }: { authenticatedUser: IUser }) => {
  const menu = [
    {
      label: "Profile",
      path: "/profile/" + authenticatedUser.id,
    },
    {
      label: "Info",
      path: "/profile/" + authenticatedUser.id + "/info",
    },
    {
      label: "Friends",
      path: "/profile/" + authenticatedUser.id + "/friends",
    },
    {
      label: "Images",
      path: "/profile/" + authenticatedUser.id + "/images",
    },
    {
      label: "Videos",
      path: "/profile/" + authenticatedUser.id + "/videos",
    },

  ];
  const [columns, setColumns] = useState(2);
  const location = useLocation();
  useEffect(()=>{
    const handleResize = ()=>{
        if (window.innerWidth < 640) {
            setColumns(2);
        } else if (window.innerWidth < 1024) {
            setColumns(4);
        } else {
            setColumns(6);
        }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [])

  return (
    <div className="w-full my-5">
      <ul className={`grid gap-4`} style={{ 
        gridTemplateColumns: `repeat(${columns + 1}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(50px, auto)",
       }}>
        {menu.slice(0, columns).map((item) => (
          <Link
          style={{
            color: location.pathname === item.path ? 'var(--primary-color-dark)' : '',
          }}
          className="p-2 relative font-semibold text-gray-500 hover:text-gray-900 col-span-1 text-center rounded-md" to={item.path} key={item.path}>
            <li>{item.label}</li>
            {location.pathname === item.path && (
              <span className="absolute bottom-0 w-[50%] left-1/2 transform -translate-x-1/2 h-1 bg-[var(--primary-color-dark)] rounded-b-md"></span>
            )}
          </Link>
        ))}
        {menu.length > columns && (
          <button className="p-2 hover:bg-gray-200 col-span-1">
            More
          </button>
        )}
      </ul>
    </div>
  );
};

export default ProfileMenu;
