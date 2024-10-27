import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlaidLink } from 'react-plaid-link';
import { Home } from 'lucide-react';
import greenpiggy from "/Green Piggy Bank with Graduation Cap.png";

const Login = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream text-gray-800">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-md transition-all">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img src={greenpiggy} alt="FinTeach Logo" className="h-16 w-auto mr-2" />
            <h1 className="text-4xl font-bold text-[#5aa832] italic">FinTeach</h1>
          </div>
          <p className="text-gray-600">Financial Planning for Educators</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {linkToken && (
          <PlaidLink
            token={linkToken}
            onSuccess={handleOnSuccess}
            onExit={(err, metadata) => console.log('Plaid Link exited:', err, metadata)}
            className="w-full py-3 bg-[#5aa832] text-fidelity-green font-semibold rounded-lg hover:bg-[#4c8f2a] transition-colors duration-200 text-center"
          >
            Connect Your Bank with Plaid
          </PlaidLink>
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
