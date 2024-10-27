import React, { useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PlaidDemo() {
  const [linkToken, setLinkToken] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [error, setError] = useState(null);

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
        setError('Failed to fetch link token. Please check the console for more details.');
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

        // Fetch financial data after successful token exchange
        const financialDataResponse = await fetch('http://127.0.0.1:5000/get_financial_data');
        
        if (!financialDataResponse.ok) {
            throw new Error(`Failed to fetch financial data: ${financialDataResponse.statusText}`);
        }

        const data = await financialDataResponse.json();
        setFinancialData(data);  // Set the financial data in state
    } catch (error) {
        console.error('Error:', error);
        setError(`Failed to fetch financial data: ${error.message}`);
    }
  };

  const renderAccountsSummary = () => {
    if (!financialData || !financialData.accounts) return null;

    return (
      <div>
        <h2>Accounts Summary</h2>
        {financialData.accounts.map(account => (
          <div key={account.account_id}>
            <h3>{account.name} ({account.type})</h3>
            <p>Current Balance: ${account.balances.current}</p>
            <p>Available Balance: ${account.balances.available}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderTransactions = () => {
    if (!financialData || !financialData.transactions) return null;

    return (
      <div>
        <h2>Recent Transactions</h2>
        <ul>
          {financialData.transactions.slice(0, 10).map(transaction => (
            <li key={transaction.transaction_id}>
              {transaction.date}: {transaction.name} - ${transaction.amount}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderInvestments = () => {
    if (!financialData || !financialData.investments) return null;

    const holdingsData = {
      labels: financialData.investments.holdings.map(h => h.security_id),
      datasets: [{
        label: 'Holdings Value',
        data: financialData.investments.holdings.map(h => h.institution_value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    };

    return (
      <div>
        <h2>Investments</h2>
        <h3>Holdings</h3>
        <Line data={holdingsData} />
        <h3>Recent Investment Transactions</h3>
        <ul>
          {financialData.investments.transactions.slice(0, 5).map(tx => (
            <li key={tx.investment_transaction_id}>
              {tx.date}: {tx.name} - ${tx.amount}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Financial Dashboard for Texas Teacher</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!financialData && linkToken && (
        <PlaidLink
          token={linkToken}
          onSuccess={handleOnSuccess}
          onExit={(err, metadata) => console.log('Plaid Link exited:', err, metadata)}
        >
          Connect Your Bank Account
        </PlaidLink>
      )}

      {!linkToken && !error && <p>Loading...</p>}

      {financialData && (
        <div>
          {renderAccountsSummary()}
          {renderTransactions()}
          {renderInvestments()}
        </div>
      )}
    </div>
  );
}

export default PlaidDemo;
