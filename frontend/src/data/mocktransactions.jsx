// src/data/mockTransactions.js

// Mock transaction data, similar to what you expect from Plaid
const mockTransactions = [
    {
      transaction_id: '1',
      amount: -2000, // Represents income (e.g., salary)
      date: '2023-10-25',
      name: 'Salary',
      category: ['Income'],
    },
    {
      transaction_id: '2',
      amount: 50, // Represents an expense (e.g., groceries)
      date: '2023-10-26',
      name: 'Groceries',
      category: ['Food'],
    },
    {
      transaction_id: '3',
      amount: 120, // Represents an expense (e.g., utilities)
      date: '2023-10-27',
      name: 'Utilities',
      category: ['Bills'],
    },
    // Add more sample transactions as needed
  ];
  
  export default mockTransactions;
  