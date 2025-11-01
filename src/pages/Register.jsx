/**
 * Register.jsx
 * Owner: Ryan
 * Description: Page for new user registration.
 */

import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="page-container">
      <RegisterForm />
    </div>
  );
}


// TODO: Import and render RegisterForm component
// - Handle registration logic
// - Redirect to login or dashboard on success
