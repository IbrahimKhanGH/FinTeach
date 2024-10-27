import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fidelityLogo from "/fidelity.svg";
import Chatbox from "../chatbot/chatbox"; // Import the Chatbox component
import { User, LogOut, Settings, MessageSquare } from "lucide-react"; // MessageSquare icon for the chat button
import greenpiggy from "/Green Piggy Bank with Graduation Cap.png";


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
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={greenpiggy} alt="Logo" />
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
          </div>

          {/* Desktop Navigation, Chat button, and Profile menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/retirement">Retirement</NavLink>
            <NavLink to="/income-expenses">Income/Expenses</NavLink>
            <NavLink to="/educationresources">Education Resources</NavLink>
            <NavLink to="/plaid-demo">Plaid Demo</NavLink>
            <NavLink to="/settings">Settings</NavLink>
            
            {/* Chat button */}
            <button
              onClick={() => setChatboxOpen(!chatboxOpen)}
              className="text-gray-700 hover:text-fidelity-green focus:outline-none"
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
          </div>

          {/* Mobile menu button */}
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
              <NavLink to="/settings">Settings</NavLink>
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
