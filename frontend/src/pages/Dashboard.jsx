// src/pages/Dashboard.jsx
import { useState } from 'react';
import UpcomingCalendar from '../components/dashboard/UpcomingCalendar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [monthlyIncome] = useState(5000);
  const [monthlyExpenses] = useState(3800);
  const [currentSavings] = useState(45000);
  const [savingsGoal] = useState(100000);

  // Example line chart data for spending
  const spendingData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Spending ($)',
        data: [500, 1200, 3000, 3800],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Greeting and Monthly Spend */}
        <div className="lg:col-span-2 bg-white p-6 shadow rounded-lg">
          <h2 className="text-3xl font-bold">Good afternoon, Ibrahim</h2>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg">Current spend this month</p>
            <p className="text-sm text-gray-500">Payday is today</p>
          </div>
          <Line data={spendingData} />
        </div>

        {/* Column 2: Financial Summary */}
        <div className="space-y-4">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Monthly Income</h3>
            <p className="text-2xl font-bold text-green-600">${monthlyIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Monthly Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${monthlyExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Current Savings</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${currentSavings.toLocaleString()} / ${savingsGoal.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Savings Goal</h3>
            <p className="text-2xl font-bold text-purple-600">{((currentSavings / savingsGoal) * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Row 2: Additional Information and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <ul className="space-y-2">
            {[
              { date: '10/25', name: 'Think Academy', amount: '$500.00' },
              { date: '10/24', name: 'Interest Charge', amount: '$25.00' },
              { date: '10/23', name: 'App Store Subscriptions', amount: '$19.99' },
            ].map((transaction, index) => (
              <li key={index} className="flex justify-between text-gray-700">
                <span>{transaction.date} - {transaction.name}</span>
                <span>{transaction.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Upcoming Financial Deadlines</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Tax Filing Deadline</span>
              <span className="text-sm text-gray-500">April 15, 2024</span>
            </li>
            <li className="flex justify-between">
              <span>Benefits Enrollment</span>
              <span className="text-sm text-gray-500">May 1 - May 31, 2024</span>
            </li>
          </ul>
        </div>
      </div>

      <UpcomingCalendar />

      {/* Row 3: Financial Tips */}
      <div className="bg-white p-6 shadow rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">Financial Tip of the Day</h3>
        <p className="text-sm text-gray-700">
          Did you know you can deduct up to $250 of unreimbursed classroom expenses on your federal taxes?
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
