/**
 * useAuth.js
 * Owner: Ryan
 * Description: Custom React hook to access authentication context.
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  return useContext(AuthContext);
}


// TODO: Implement hook to access AuthContext
// - Return user info and auth methods (login, logout)
