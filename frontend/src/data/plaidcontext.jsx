// src/PlaidContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const PlaidContext = createContext();

export function PlaidProvider({ children }) {
  const [plaidData, setPlaidData] = useState(() => {
    const storedData = localStorage.getItem('plaidData');
    return storedData ? JSON.parse(storedData) : {};
  });

  useEffect(() => {
    localStorage.setItem('plaidData', JSON.stringify(plaidData));
  }, [plaidData]);

  const addPlaidData = (accountId, data) => {
    console.log("Storing data in PlaidContext for account:", accountId, data); // Add this line
    setPlaidData((prevData) => ({ ...prevData, [accountId]: data }));
  };


  return (
    <PlaidContext.Provider value={{ plaidData, addPlaidData }}>
      {children}
    </PlaidContext.Provider>
  );
}

export function usePlaid() {
  return useContext(PlaidContext);
}
