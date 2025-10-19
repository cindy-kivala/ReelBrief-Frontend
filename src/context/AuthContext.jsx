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
import { useContext, createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = { user, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
