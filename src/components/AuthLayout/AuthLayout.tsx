import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="grid grid-rows-[auto-1fr-auto] h-screen bg-[var(--background-color)]">
      <header className="mx-auto container p-4 flex gap-4 ">
        <img src="/logo.png" alt="Logo" className="logo w-28 h-28 rounded-md" />
        <p className="text-2xl font-semibold text-gray-800 ">Tận dụng tối đa cuộc sống nghề nghiệp của bạn</p>
      </header>
      <main className="container mx-auto px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white p-4">
        <ul className="container mx-auto flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
          <li>
            <img src="/dark-logo.png" alt="dark logo" className="rounded-md w-12"/>
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
