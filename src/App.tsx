import { useState } from "react";
import Button from "@mui/material/Button";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard/AuthGuard";
import AppLayout from "./components/AppLayout/AppLayout";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import Login from "./features/auth/pages/Login/Login";
import Register from "./features/auth/pages/Register/Register";
import ResetPassword from "./features/auth/pages/ResetPassword/ResetPassword";
import VerifyEmail from "./features/auth/pages/VerifyEmail/VerifyEmail";
import Profile from "./features/auth/pages/Profile/Profile";
import Networking from "./features/networking/pages/Networking/Networking";
import Invitations from "./features/networking/pages/Invitations/Invitations";
import Connections from "./features/networking/pages/Connections/Connections";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<div>Home Page</div>} />
              <Route path="/networking" element={<Networking />}>
                <Route path="invitations" element={<Invitations />} />
                <Route path="connections" element={<Connections />} />
              </Route>
            </Route>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="request-password-reset"
                element={<ResetPassword />}
              />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="profile/:userId" element={<Profile />} />
            </Route>

            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
