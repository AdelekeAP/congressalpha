import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">CongressAlpha</h1>
      <div className="space-x-4 text-sm text-gray-600">
        <a href="#" className="hover:text-indigo-500">Dashboard</a>
        <a href="#" className="hover:text-indigo-500">Watchlist</a>
      </div>
    </nav>
  );
};

export default Navbar;
