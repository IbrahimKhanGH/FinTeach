// src/pages/IncomeExpenses.jsx
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import mockTransactions from '../data/mocktransactions';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  

function IncomeExpenses() {
  const [transactions, setTransactions] = useState([]);

  // Use mock data initially
  useEffect(() => {
    // Here, instead of fetching from an API, we use the mock data
    setTransactions(mockTransactions);
  }, []);

  // Process transactions
  const incomeTransactions = transactions.filter((t) => t.amount < 0);
  const expenseTransactions = transactions.filter((t) => t.amount > 0);

  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const netIncome = totalIncome - totalExpenses;

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#10B981', '#EF4444'],
      },
    ],
  };

  return (
    <div className="income-expenses p-4">
      <h2 className="text-2xl font-bold mb-4">Income & Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income Section */}
        <div>
          <h3 className="text-xl font-semibold">Income</h3>
          <p className="text-green-600 text-lg">
            ${totalIncome.toFixed(2)}
          </p>
          <ul className="mt-2">
            {incomeTransactions.map((t) => (
              <li key={t.transaction_id}>
                {t.date} - {t.name}: $
                {Math.abs(t.amount).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        {/* Expenses Section */}
        <div>
          <h3 className="text-xl font-semibold">Expenses</h3>
          <p className="text-red-600 text-lg">
            ${totalExpenses.toFixed(2)}
          </p>
          <ul className="mt-2">
            {expenseTransactions.map((t) => (
              <li key={t.transaction_id}>
                {t.date} - {t.name}: ${t.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Net Income */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Net Income</h3>
        <p className="text-lg">${netIncome.toFixed(2)}</p>
      </div>

      {/* Chart */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default IncomeExpenses;
