import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import NavbarLanding from './components/layout/Navbarlanding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Retirement from './pages/Retirement';
import IncomeExpenses from './pages/ExpsenseTracker';
import EducationResources from './pages/EducationResources';
import PlaidDemo from './pages/PlaidDemo';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const location = useLocation();

  // Define paths where NavbarLanding should be displayed
  const landingPaths = ['/', '/login', '/signup'];
  const isLandingPage = landingPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full bg-cream">
      {/* Conditionally render NavbarLanding or Navbar */}
      {isLandingPage ? <NavbarLanding /> : <Navbar />}

      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/retirement" element={<Retirement />} />
          <Route path="/income-expenses" element={<IncomeExpenses />} />
          <Route path="/educationresources" element={<EducationResources />} />
          <Route path="/plaid-demo" element={<PlaidDemo />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

// Wrap App component with Router to use useLocation
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
