import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * MainLayout - Layout chính cho các trang công khai
 * Bao gồm Header, Footer và nội dung trang chính
 */
const MainLayout = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
