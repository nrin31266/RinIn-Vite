import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
const ProfileNav = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [showProfileNav, setShowProfileNav] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
    // refs để check click ngoài
      const isProfileOpenRef = useRef(showProfileNav);
      const contentRef = useRef<HTMLDivElement>(null);
      const toggleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      isProfileOpenRef.current = showProfileNav;
    }, [showProfileNav]);
    // Mount listener chỉ một lần
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node) &&
                toggleRef.current &&
                !toggleRef.current.contains(event.target as Node)
            ) {
                setShowProfileNav(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

  return (
    <div>
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setShowProfileNav(!showProfileNav)}
        ref={toggleRef}
      >
        <img
          src={user?.profilePicture || "/avatar.jpg"}
          alt={user?.id}
          className="h-8 w-8 rounded-full object-cover"
        />
        <h1 className="max-w-12 overflow-ellipsis overflow-hidden line-clamp-1 text-xs ">
          {user?.firstName + " " + user?.lastName || "Unknown User"}
        </h1>
      </div>

      {showProfileNav && (
        <div ref={contentRef} className="absolute flex flex-col gap-4 right-0 top-12 bg-white rounded-[0.3rem_0_0.3rem_0.3rem] shadow-xs border-1 border-gray-200 p-4 z-50 w-[min(18rem, 100%)]">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePicture || "/avatar.jpg"}
              alt={user?.id}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h1 className="text-md font-semibold">
                {user?.firstName + " " + user?.lastName || "Unknown User"}
              </h1>
              <p className="text-sm text-gray-500">
                {user?.position + " at " + user?.company || "Unknown Company"}
              </p>
            </div>
          </div>
          <Button size="small" variant="outlined" fullWidth>
            View Profile
          </Button>
          <ul className="flex flex-col gap-2 text-sm text-gray-500 cursor-pointer w-max">
            <li className=" hover:text-[var(--text-color)]">Settings</li>
            <li
              className=" hover:text-[var(--text-color)]"
              onClick={() => {
                dispatch(logout());
                navigate("/login", { state: { from: location.pathname } });
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileNav;
