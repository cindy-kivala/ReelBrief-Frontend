/**
 * useAuth.js
 * Owner: Ryan
 * Description: Convenience hook to access the AuthContext.
 */

import { useContext } from "react";
import AuthContext from '/src/context/AuthContext.jsx';

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
