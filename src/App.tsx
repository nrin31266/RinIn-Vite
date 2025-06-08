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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<AppLayout />} />
            <Route path="/auth" element={<AuthLayout />} >
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="request-password-reset" element={<ResetPassword />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="profile/:userId" element={<div>User Profile Page</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
