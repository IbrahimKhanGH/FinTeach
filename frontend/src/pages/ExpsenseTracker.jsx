// src/pages/IncomeExpenses.jsx
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import earlyCareerData from "../data/early_career.json";
import middleCareerData from "../data/middle_career.json";
import lateCareerData from "../data/late_career.json";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { Wallet, TrendingUp, TrendingDown, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import

function IncomeExpenses() {
  const navigate = useNavigate(); // Add this line
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [careerStage, setCareerStage] = useState(() => {
    return localStorage.getItem("careerStage") || "early";
  });
  const [recommendedBudget, setRecommendedBudget] = useState({});
  const [adjustedBudget, setAdjustedBudget] = useState({});
  const [expenseCategories, setExpenseCategories] = useState([
    { name: "Housing", percentage: 30 },
    { name: "Food", percentage: 15 },
    { name: "Transportation", percentage: 10 },
    { name: "Savings", percentage: 20 },
    { name: "Entertainment", percentage: 5 },
    { name: "Miscellaneous", percentage: 5 },
  ]);

  const [newCategory, setNewCategory] = useState({ name: "", percentage: "" });
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    let data;
    switch (careerStage) {
      case "early":
        data = earlyCareerData;
        break;
      case "middle":
        data = middleCareerData;
        break;
      case "late":
        data = lateCareerData;
        break;
      default:
        data = earlyCareerData;
    }
    const transactionsWithIds = data.transactions.map((t, index) => ({
      transaction_id: t.transaction_id || `txn-${index}`,
      ...t,
    }));
    setTransactions(transactionsWithIds);

    calculateRecommendedBudget(transactionsWithIds);
  }, [careerStage]);

  const incomeTransactions = transactions.filter((t) => t.amount > 0);
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesAmount = expenseTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const netIncome = totalIncome - totalExpensesAmount;

  const filteredTransactions = transactions
    .filter(
      (t) =>
        filterType === "all" ||
        (filterType === "income" ? t.amount > 0 : t.amount < 0)
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  const calculateRecommendedBudget = (transactions) => {
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.amount < 0) {
        const category = t.category || "Other";
        categoryTotals[category] =
          (categoryTotals[category] || 0) + Math.abs(t.amount);
      }
    });

    const totalExpenses = Object.values(categoryTotals).reduce(
      (sum, amount) => sum + amount,
      0
    );
    setTotalExpenses(totalExpenses);

    const recommended = {};
    expenseCategories.forEach((category) => {
      recommended[category.name] = {
        amount: (totalExpenses * category.percentage) / 100,
        percentage: category.percentage,
      };
    });

    setRecommendedBudget(recommended);
    setAdjustedBudget(recommended);
  };

  const handleBudgetChange = (category, newPercentage) => {
    const adjusted = { ...adjustedBudget };
    const newAmount = totalIncome * (newPercentage / 100);

    // Calculate the total budget allocation including the new change
    const totalAllocation = Object.entries(adjusted).reduce(
      (sum, [cat, budget]) => {
        return sum + (cat === category ? newAmount : budget.amount);
      },
      0
    );

    // Check if the new total allocation exceeds the total income
    if (totalAllocation > totalIncome) {
      // If it does, don't update the state
      return;
    }

    // If it doesn't exceed, update the state
    adjusted[category] = {
      percentage: newPercentage,
      amount: newAmount,
    };
    setAdjustedBudget(adjusted);
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.percentage) {
      setExpenseCategories([...expenseCategories, newCategory]);
      setNewCategory({ name: "", percentage: "" });
    }
  };

  const expenseData = {
    labels: expenseCategories.map((cat) => cat.name),
    datasets: [
      {
        data: expenseCategories.map(
          (cat) => adjustedBudget[cat.name]?.amount || 0
        ),
        backgroundColor: [
          "#F87171",
          "#FBBF24",
          "#34D399",
          "#60A5FA",
          "#A78BFA",
          "#F472B6",
          "#FCD34D",
          "#9CA3AF",
        ],
      },
    ],
  };

  const TransactionList = ({ transactions }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
      <ul className="space-y-1 flex-grow overflow-y-auto">
        {transactions.map((t, index) => (
          <li
            key={t.transaction_id || index}
            className="flex justify-between py-1 border-b border-gray-100"
          >
            <span className="text-sm text-gray-600">
              {t.date} - {t.description}
            </span>
            <span
              className={`text-sm font-medium ${
                t.amount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {t.amount > 0 ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const SummaryCard = ({
    title,
    amount,
    icon: Icon,
    color,
    forceNegative = false,
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300 ease-in-out`}
    >
      <div className="flex items-center mb-2">
        <div
          className={`p-2 ${color.replace(
            "text-",
            "bg-"
          )} bg-opacity-20 rounded-lg mr-3`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-md font-semibold">{title}</h3>
      </div>
      <p className={`text-xl font-bold ${color}`}>
        {forceNegative || amount < 0 ? "-" : "+"}${Math.abs(amount).toFixed(2)}
      </p>
    </div>
  );

  // Add this new function to reset the budget
  const resetToRecommendedBudget = () => {
    setAdjustedBudget(recommendedBudget);
  };

  return (
    <div className="income-expenses p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-[#025742]">
        Income/Expense Tracker
      </h1>
      <p className="text-lg text-center mb-8 text-gray-600">
        Track your finances with confidence
      </p>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            color="text-green-600"
          />
          <SummaryCard
            title="Total Expenses"
            amount={totalExpensesAmount}
            icon={TrendingDown}
            color="text-red-600"
            forceNegative={true}
          />
          <SummaryCard
            title="Net Income"
            amount={netIncome}
            icon={Wallet}
            color={netIncome >= 0 ? "text-blue-600" : "text-orange-600"}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction History - Full height */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-200px)]">
            <TransactionList transactions={filteredTransactions} />
          </div>

          {/* Budget and Expenses Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Section */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recommended Budget</h3>
                <button
                  onClick={resetToRecommendedBudget}
                  className="px-4 py-2 bg-[#025742] text-white rounded-md hover:bg-[#013D2C] transition"
                >
                  Reset to Recommended
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenseCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-600">
                        $
                        {(adjustedBudget[category.name]?.amount || 0).toFixed(
                          2
                        )}
                      </p>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={adjustedBudget[category.name]?.percentage || 0}
                      onChange={(e) =>
                        handleBudgetChange(
                          category.name,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {(adjustedBudget[category.name]?.percentage || 0).toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-xl font-semibold mb-4">Expenses Breakdown</h3>
              <div className="h-[300px]">
                <Doughnut
                  data={expenseData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeExpenses;
