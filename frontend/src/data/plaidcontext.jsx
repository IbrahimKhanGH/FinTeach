// src/PlaidContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const PlaidContext = createContext();

export function PlaidProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  const addPlaidData = (userId, data) => {
    setCurrentUser({ userId, ...data });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <PlaidContext.Provider value={{ currentUser, addPlaidData, logout }}>
      {children}
    </PlaidContext.Provider>
  );
}

export function usePlaid() {
  return useContext(PlaidContext);
}
