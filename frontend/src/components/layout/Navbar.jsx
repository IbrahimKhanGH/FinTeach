// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import viteLogo from "/vite.svg";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          isActive
            ? "border-fidelity-green text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={viteLogo} alt="Logo" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                FinTeach
              </span>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/retirement">Retirement</NavLink>
              <NavLink to="/income-expenses">Income/Expenses</NavLink>
              <NavLink to="/educationresources">Education Resources</NavLink>
              <NavLink to="/PlaidDemo">Plaid Demo</NavLink>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fidelity-green"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/retirement">Retirement</NavLink>
            <NavLink to="/income-expenses">Income/Expenses</NavLink>
            <NavLink to="/educationresources">Education Resources</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
