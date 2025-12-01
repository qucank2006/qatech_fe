import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main className="pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
