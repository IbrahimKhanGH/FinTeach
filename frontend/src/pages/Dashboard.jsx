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
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [monthlyIncome] = useState(5000);
  const [monthlyExpenses] = useState(3800);
  const [currentSavings] = useState(45000);
  const [savingsGoal] = useState(100000);
  const [monthlyInvestments] = useState(800); // New: Monthly investments
  const [retirementReadiness] = useState(65); // Placeholder for retirement readiness score out of 100

  const getRetirementGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const cashFlowData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Monthly Cash Flow",
        data: [monthlyIncome, monthlyExpenses],
        backgroundColor: ["#10B981", "#EF4444"], // Green for income, red for expenses
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#025742] to-emerald-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 lg:px-12 py-8 lg:py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Ibrahim</h1>
            <p className="text-lg text-white/90">Here's an overview of your financial health</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Retirement Grade */}
          <div className="bg-white p-6 shadow-sm rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Retirement Readiness</h2>
            <div className="relative w-40 h-40 mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${retirementReadiness}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{retirementReadiness}%</span>
                <span className="text-2xl font-bold text-[#025742]">
                  {getRetirementGrade(retirementReadiness)}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { label: "Monthly Income", value: monthlyIncome, color: "text-green-600" },
                { label: "Monthly Expenses", value: monthlyExpenses, color: "text-red-600" },
                { label: "Current Savings", value: currentSavings, color: "text-blue-600" },
                { label: "Monthly Investments", value: monthlyInvestments, color: "text-purple-600" },
              ].map((item, index) => (
                <div key={index} className="bg-white p-4 shadow-sm rounded-xl flex flex-col items-center">
                  <h3 className="text-sm font-semibold mb-2 text-gray-600">{item.label}</h3>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    ${item.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Cash Flow */}
          <div className="bg-white p-6 shadow-sm rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Cash Flow
            </h3>
            <div style={{ height: "300px" }}>
              <Bar
                data={cashFlowData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 shadow-sm rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Transactions
            </h3>
            <ul className="space-y-3">
              {[
                { date: "10/25", name: "Think Academy", amount: "$500.00" },
                { date: "10/24", name: "Interest Charge", amount: "$25.00" },
                { date: "10/23", name: "App Store Subscriptions", amount: "$19.99" },
              ].map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm text-gray-700 bg-gray-50 p-3 rounded-lg"
                >
                  <span>
                    {transaction.date} - {transaction.name}
                  </span>
                  <span className="font-semibold">{transaction.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Financial Tip of the Day */}
        <div className="bg-white p-6 shadow-sm rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Financial Tip of the Day
          </h3>
          <p className="text-sm text-gray-700 bg-green-50 border-l-4 border-[#025742] p-4 rounded-r-lg">
            Did you know you can deduct up to $250 of unreimbursed classroom
            expenses on your federal taxes?
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
