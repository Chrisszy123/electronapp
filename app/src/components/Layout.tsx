import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './Navbar';

const Layout: React.FC = () => {
    const electron = (window as any).electron
  return (
    <div className="mx-auto max-w-4xl">
      <NavBar />
      <div className="py-2 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
