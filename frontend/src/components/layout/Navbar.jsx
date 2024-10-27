import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fidelityLogo from "/fidelity.svg";
import Chatbox from "../chatbot/chatbox"; // Import the Chatbox component
import { User, LogOut, Settings, MessageSquare } from "lucide-react"; // MessageSquare icon for the chat button

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chatboxOpen, setChatboxOpen] = useState(false); // State to control Chatbox visibility
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

  const handleLogout = () => navigate("/login");

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and FinTeach title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={fidelityLogo} alt="Logo" />
              <div
                className="ml-2 font-sans text-4xl font-bold tracking-tight"
                style={{
                  color: "#5aa832",
                  transform: "skew(-10deg)",
                  letterSpacing: "-0.02em",
                }}
              >
                FinTeach
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/retirement">Retirement</NavLink>
              <NavLink to="/income-expenses">Income/Expenses</NavLink>
              <NavLink to="/educationresources">Education Resources</NavLink>
              <NavLink to="/plaid-demo">Plaid Demo</NavLink>
              <NavLink to="/settings">Settings</NavLink>
            </div>
          </div>

          {/* Chat button and profile menu */}
          <div className="flex items-center">
            {/* Chat button */}
            <button
              onClick={() => setChatboxOpen(!chatboxOpen)}
              className="mr-4 text-gray-700 hover:text-fidelity-green focus:outline-none"
              aria-label="Chat with Assistant"
            >
              <MessageSquare className="h-6 w-6" />
            </button>

            {/* Profile button */}
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-fidelity-green focus:ring-offset-2"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            </button>

            {/* Profile dropdown */}
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

        {/* Mobile Navigation */}
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
      </div>

      {/* Render Chatbox component when chatboxOpen is true */}
      {chatboxOpen && <Chatbox />}
    </nav>
  );
}

export default Navbar;
