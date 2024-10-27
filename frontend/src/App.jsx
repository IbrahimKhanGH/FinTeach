import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Retirement from './pages/Retirement';
import IncomeExpenses from './pages/ExpsenseTracker';
import EducationResources from './pages/EducationResources';
import PlaidDemo from './pages/PlaidDemo';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CareerStageSelection from './pages/CareerStageSelection';

function App() {
  const location = useLocation();

  // Define paths where Navbar should be displayed
  const showNavbarPaths = ['/dashboard', '/retirement', '/income-expenses', '/educationresources', '/settings'];

  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full bg-cream">
      {shouldShowNavbar && <Navbar />}

      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/career-stage-selection" element={<CareerStageSelection />} />
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
