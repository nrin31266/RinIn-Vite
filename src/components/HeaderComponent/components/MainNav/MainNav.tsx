import { useEffect, useRef, useState } from "react";
import { data, NavLink, useLocation } from "react-router-dom";
import {
  fetchInvitations,
  type IConnection,
} from "../../../../store/networkingSlide";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import Badge from "@mui/material/Badge";
import { useWebSocket } from "../../../../features/ws/WebSocketProvider";

const MainNav = () => {
  const location = useLocation();
  const isLargeScreen = window.innerWidth >= 768;
  const [showNavigationMenu, setShowNavigationMenu] = useState(
    isLargeScreen ? true : false
  );
  const { user } = useAppSelector((state) => state.auth);
  const [invitations, setInvitations] = useState<IConnection[]>([]);
  const dispatch = useAppDispatch();
  const ws = useWebSocket();
  // refs để check click ngoài
  const isMenuOpenRef = useRef(showNavigationMenu);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Mỗi khi state thay đổi, cập nhật ref
  useEffect(() => {
    isMenuOpenRef.current = showNavigationMenu;
  }, [showNavigationMenu]);

  // Mount listener chỉ một lần
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isMenuOpenRef.current && // dùng ref để kiểm tra
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setShowNavigationMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // chạy 1 lần khi mount

  // Cập nhật showNavigationMenu khi kích thước cửa sổ thay đổi
  useEffect(() => {
    const handleResize = () => {
      setShowNavigationMenu(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/connections/new`,
      (res) => {
        const data: IConnection = JSON.parse(res.body);
        if (data && data.recipient.id === user?.id) {
          setInvitations((prev) => [...prev, data]);
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);
  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/connections/rejected`,
      (res) => {
        const data: IConnection = JSON.parse(res.body);
        if (data && data.recipient.id === user?.id) {
          setInvitations((prev) =>
            prev.filter((invitation) => invitation.id !== data.id)
          );
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);
  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/connections/seen`,
      (res) => {
        const data: IConnection = JSON.parse(res.body);
        if (data && data.recipient.id === user?.id) {
          setInvitations((prev) =>
            prev.filter((invitation) => invitation.id !== data.id)
          );
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);

  //   useEffect(() => {
  //     const subscription = ws?.subscribe(
  //       `/topic/users/${user?.id}/connections/accepted`,
  //       (res) => {
  //         const data: IConnection = JSON.parse(res.body);
  //         if (data && data.recipient.id === user?.id) {
  //           setInvitations((prev) =>
  //             prev.filter((invitation) => invitation.id !== data.id)
  //           );
  //         }
  //       }
  //     );
  //     return () => subscription?.unsubscribe();
  //   }, [ws, user?.id]);

  useEffect(() => {
    dispatch(fetchInvitations())
      .unwrap()
      .then((data) => {
        console.log(data);
        setInvitations(
          data.filter(
            (invitation) =>
              !invitation.seen && invitation.recipient.id === user?.id
          )
        );
      });
  }, [user?.id, dispatch]);

  return (
    <div>
      {showNavigationMenu ? (
        <nav
          ref={navRef}
          className="absolute md:static w-max right-16 bottom-0 md:top-auto top-12 md:border-none bg-white rounded-sm p-4 h-max md:bg-transparent border-1 border-gray-200 shadow-xs md:shadow-none z-50 md:p-0"
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-4 ">
            <li>
              <NavLink
                to="/"
                className="flex md:flex-col items-center gap-2 md:gap-0 text-gray-500 hover:text-[var(--text-color)]"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary-color)" : undefined,
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                </svg>
                <h1 className="text-xs">Home</h1>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/networking/invitations"
                className="flex md:flex-col items-center gap-2 md:gap-0 text-gray-500 hover:text-[var(--text-color)]"
                style={{
                  color: location.pathname.startsWith("/networking")
                    ? "var(--primary-color)"
                    : undefined,
                }}
              >
                <Badge badgeContent={invitations.length} color="error" max={99}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                    width="24"
                    height="24"
                  >
                    <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                  </svg>
                </Badge>
                <h1 className="text-xs">Network</h1>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/messaging"
                className="flex md:flex-col items-center gap-2 md:gap-0 text-gray-500 hover:text-[var(--text-color)]"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary-color)" : undefined,
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  focusable="false"
                  width="24"
                  height="24"
                >
                  <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                </svg>
                <h1 className="text-xs">Messages</h1>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notifications"
                className="flex md:flex-col items-center gap-2 md:gap-0 text-gray-500 hover:text-[var(--text-color)]"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary-color)" : undefined,
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  focusable="false"
                  width="24"
                  height="24"
                >
                  <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                </svg>
                <h1 className="text-xs">Notifis</h1>
              </NavLink>
            </li>
          </ul>
        </nav>
      ) : null}
      {!isLargeScreen ? (
        <button
          onClick={() => {
            setShowNavigationMenu((prev) => !prev);
          }}
          className="flex flex-col items-center justify-center text-gray-500 hover:text-[var(--text-color)]"
          style={{
            color: showNavigationMenu ? "var(--text-color)" : undefined,
          }}
          ref={toggleRef}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
          </svg>
          <h1 className="text-xs">Menu</h1>
        </button>
      ) : null}
    </div>
  );
};

export default MainNav;
