import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { fetchUser } from "../../store/authSlice";
import Loading from "../Loading/Loading";

const AuthGuard = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const isOnAuthPage = [
    "/auth/login",
    "/auth/register",
    "/auth/request-password-reset",
  ].includes(location.pathname);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, location.pathname]);

  if (status.fetchUser === "loading" || status.fetchUser === "idle") {
    return <Loading/>;
  }
  

  // Chưa login
  if (!user && !isOnAuthPage) {
    return <Navigate to="/auth/login" state={{ from: location.pathname + location.search }} />;
  }

  // Email chưa verify
  if (user && !user.emailVerified && location.pathname !== '/auth/verify-email') {
    return <Navigate to="/auth/verify-email" />;
  }
  if (user && user.emailVerified && location.pathname === '/auth/verify-email') {
    return <Navigate to="/" />;
  }

  // Chưa hoàn tất profile
  if (user && user.emailVerified && !user.profileComplete && !location.pathname.includes('/auth/profile')) {
    return <Navigate to={`/auth/profile/${user.id}`} />;
  }
  if (user && user.emailVerified && user.profileComplete && location.pathname.includes('/auth/profile')) {
    return <Navigate to="/" />;
  }

  // Truy cập trang / khi đã login
  if (user && isOnAuthPage) {
    return <Navigate to={location.state?.from  || '/'} />;
  }

  return <Outlet />;
};

export default AuthGuard;
