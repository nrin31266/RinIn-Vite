import { useState } from "react";
import Button from "@mui/material/Button";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard/AuthGuard";
import AppLayout from "./components/AppLayout/AppLayout";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import Login from "./features/auth/pages/Login/Login";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<AppLayout />} />
            <Route path="/auth" element={<AuthLayout />} >
              <Route path="login" element={<Login />} />
              <Route path="register" element={<div>Register Page</div>} />
              <Route path="request-password-reset" element={<div>Request Password Reset Page</div>} />
              <Route path="verify-email" element={<div>Verify Email Page</div>} />
              <Route path="profile/:userId" element={<div>User Profile Page</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
