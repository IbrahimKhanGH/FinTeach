import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// Import your new pages/components here
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Retirement from './pages/Retirement';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/retirement">Retirement</Link>
        </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/retirement" element={<Retirement />} />
      </Routes>
    </Router>
  );
}

export default App;
