/**
 * AuthContext.jsx
 * Owner: Ryan
 * Description: Provides authentication context to the React app.
 */

// TODO: Create AuthContext
// - Manage user state and authentication token
// - Expose login, logout, register, and getCurrentUser methods

// Example:
// const AuthContext = createContext();
//Ryan, I've added these be do npm run build successfully 
// import { useContext, createContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const value = { user, setUser };
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

// AuthContext.jsx - TEMPORARY FOR TESTING
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // TEMPORARY: Mock authenticated user for testing
  const [user] = useState({
    id: 1,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: 'client' // Change to 'freelancer' or 'admin' to test different roles
  });

  const [isAuthenticated] = useState(true); // TEMPORARY: Always authenticated
  const [loading] = useState(false);

  const value = {
    user,
    isAuthenticated,
    loading,
    login: async () => {},
    logout: async () => {},
    register: async () => {}
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
