// src/pages/IncomeExpenses.jsx
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import earlyCareerData from '../data/early_career.json';
import middleCareerData from '../data/middle_career.json';
import lateCareerData from '../data/late_career.json';
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
import { Wallet, TrendingUp, TrendingDown, Filter } from 'lucide-react';

function IncomeExpenses() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [careerStage, setCareerStage] = useState('early');

  // Use selected career stage data
  useEffect(() => {
    let data;
    switch (careerStage) {
      case 'early':
        data = earlyCareerData;
        break;
      case 'middle':
        data = middleCareerData;
        break;
      case 'late':
        data = lateCareerData;
        break;
      default:
        data = earlyCareerData;
    }
    // Ensure transactions have transaction_id
    const transactionsWithIds = data.transactions.map((t, index) => ({
      transaction_id: t.transaction_id || `txn-${index}`,
      ...t,
    }));
    setTransactions(transactionsWithIds);
  }, [careerStage]);

  // Process transactions
  const incomeTransactions = transactions.filter((t) => t.amount > 0);
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
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

  // Combine and sort transactions
  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || (filterType === 'income' ? t.amount > 0 : t.amount < 0))
    .sort((a, b) => sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));

  // Helper function to split description into name and details
  const splitDescription = (description) => {
    const parts = description.split(' - ');
    return {
      name: parts[0],
      details: parts.length > 1 ? parts.slice(1).join(' - ') : ''
    };
  };

  const TransactionList = ({ transactions }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Transaction History</h3>
        <div className="flex space-x-2">
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            className="border rounded-md px-2 py-1 text-sm flex items-center"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            <Filter className="h-4 w-4 mr-1" />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>
      <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {transactions.map((t, index) => (
          <li key={t.transaction_id || index} className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
            <span className="text-sm text-gray-600">{t.date} - {t.description}</span>
            <span className={`text-sm font-medium ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(t.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const SummaryCard = ({ title, amount, icon: Icon, color }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 ease-in-out`}>
      <div className="flex items-center mb-2">
        <div className={`p-2 ${color.replace('text-', 'bg-')} bg-opacity-20 rounded-lg mr-4`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className={`text-2xl font-bold ${color}`}>${amount.toFixed(2)}</p>
    </div>
  );

  // Calculate average income and expenses safely
  const averageIncome = incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
  const averageExpense = expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0;

  return (
    <div className="income-expenses p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Income & Expenses</h2>
      <div className="mb-4">
        <label htmlFor="careerStage" className="mr-2">Career Stage:</label>
        <select
          id="careerStage"
          value={careerStage}
          onChange={(e) => setCareerStage(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="early">Early Career</option>
          <option value="middle">Middle Career</option>
          <option value="late">Late Career</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Total Income" amount={totalIncome} icon={TrendingUp} color="text-green-600" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} icon={TrendingDown} color="text-red-600" />
        <SummaryCard title="Net Income" amount={netIncome} icon={Wallet} color={netIncome >= 0 ? "text-blue-600" : "text-orange-600"} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList transactions={filteredTransactions} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Income</p>
                <p className="text-lg font-medium text-green-600">
                  ${averageIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Expense</p>
                <p className="text-lg font-medium text-red-600">
                  ${averageExpense.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
            <div className="h-64">
              <Bar data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: 'Monthly Overview'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Category'
                    }
                  }
                },
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className="transaction-history mt-8">
        <h3 className="text-2xl font-semibold mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Details</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const { name, details } = splitDescription(transaction.description);
                return (
                  <tr key={transaction.transaction_id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4">{transaction.date}</td>
                    <td className="py-2 px-4">{name}</td>
                    <td className="py-2 px-4">{details}</td>
                    <td className={`py-2 px-4 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 capitalize">{transaction.type}</td>
                    <td className="py-2 px-4">{transaction.category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IncomeExpenses;
