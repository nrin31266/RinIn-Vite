import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen bg-[var(--background-color)] gap-3">
      <header className="p-2 mx-auto container max-h-max flex gap-4 ">
        <img src="/logo.png" alt="Logo" className="logo w-20 h-20 rounded-md" />
      </header>
      <main className="container w-full h-full mx-auto space-y-8">
        <h1 className="text-2xl mx-auto text-gray-700 text-center">Tận dụng tối đa cuộc sống nghề nghiệp của bạn</h1>
        <Outlet />
      </main>
      <footer className="max-h-max bg-white p-4">
        <ul className="container mx-auto flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <img src="/dark-logo.png" alt="dark logo" className="rounded-md w-8"/>
            <span>&#169;2025</span>
          </li>
          <li>
            <a href="">About</a>
          </li>
          <li>
            <a href="">Accessibility</a>
          </li>
          <li>
            <a href="">User Agreement</a>
          </li>
          <li>
            <a href="">Private Policy</a>
          </li>
          <li>
            <a href="">Cookie Policy</a>
          </li>
          <li>
            <a href="">Copyright Policy</a>
          </li>
          <li>
            <a href="">Brand Policy</a>
          </li>
          <li>
            <a href="">Guest Controls</a>
          </li>
          <li>
            <a href="">Community Guidelines</a>
          </li>
          <li>
            <a href="">Language</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default AuthLayout;
