import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlaidLink } from 'react-plaid-link';
import { Home, User, Lock } from 'lucide-react';
import greenpiggy from "/Green Piggy Bank with Graduation Cap.png";

const Login = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    async function fetchLinkToken() {
      try {
        const response = await fetch('http://127.0.0.1:5000/create_link_token');
        if (!response.ok) {
          throw new Error(`Failed to fetch link token: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.link_token) {
          setLinkToken(data.link_token);
        } else {
          throw new Error('Link token not found in response');
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
        setError('Failed to fetch link token. Please try again later.');
      }
    }
    fetchLinkToken();
  }, []);

  const handleOnSuccess = async (public_token, metadata) => {
    try {
      const exchangeResponse = await fetch('http://127.0.0.1:5000/exchange_public_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });
      
      if (!exchangeResponse.ok) {
        throw new Error(`Failed to exchange public token: ${exchangeResponse.statusText}`);
      }

      // If successful, navigate to the career stage selection page
      navigate('/career-stage-selection');
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to authenticate: ${error.message}`);
    }
  };

  const handleLoginChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { username, password } = credentials;
    if (username && password) {
      // Here you would typically validate the credentials against a backend
      // For this example, we'll just check if both fields are non-empty
      localStorage.setItem('user', JSON.stringify({ username, password }));
      navigate('/career-stage-selection');
    } else {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-md transition-all">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img src={greenpiggy} alt="FinTeach Logo" className="h-16 w-auto mr-2" />
            <h1 className="text-4xl font-bold text-[#5aa832] italic">FinTeach</h1>
          </div>
          <p className="text-gray-600">Financial Planning for Educators</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {showLoginForm ? (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleLoginChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleLoginChange}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-fidelity-green text-white font-semibold rounded-lg hover:bg-fidelity-green-dark transition-colors duration-200"
            >
              Log In
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowLoginForm(true)}
              className="w-full py-3 mb-4 bg-[#5aa832] text-white font-semibold rounded-lg hover:bg-[#4c8f2a] transition-colors duration-200"
            >
              Log In
            </button>
            {linkToken && (
              <PlaidLink
                token={linkToken}
                onSuccess={handleOnSuccess}
                onExit={(err, metadata) => console.log('Plaid Link exited:', err, metadata)}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
              >
                Connect Your Bank with Plaid
              </PlaidLink>
            )}
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          By connecting your bank account, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Return to Home link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-[#5aa832] hover:text-[#4c8f2a] underline"
          >
            <Home className="w-4 h-4 mr-1" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
