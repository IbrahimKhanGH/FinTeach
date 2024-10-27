import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fidelityLogo from "/fidelity.svg";
import { User, LogOut, Settings } from "lucide-react";


function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-fidelity-green text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        style={{
          transform: "skew(-5deg)",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ transform: "skew(5deg)" }}>{children}</span>
      </Link>
    );
  };

  const handleLogout = () => navigate('/login');

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-grow">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={fidelityLogo} alt="Logo" />
              </Link>
              <Link to="/">
                <div
                  className="inline-block font-sans text-4xl font-bold tracking-tight"
                  style={{
                    color: "#5aa832",
                    transform: "skew(-10deg)",
                    letterSpacing: "-0.02em",
                    marginBottom: "4px",
                    marginLeft: "3px",
                  }}
                >
                  FinTeach
                </div>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/retirement">Retirement</NavLink>
              <NavLink to="/income-expenses">Income/Expenses</NavLink>
              <NavLink to="/educationresources">Education Resources</NavLink>
              <NavLink to="/plaid-demo">Plaid Demo</NavLink>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-fidelity-green focus:ring-offset-2"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
            <NavLink to="/plaid-demo">Plaid Demo</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
