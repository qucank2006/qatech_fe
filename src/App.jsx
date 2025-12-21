import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  );
}
