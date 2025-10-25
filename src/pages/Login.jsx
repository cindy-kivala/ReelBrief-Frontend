// // /**
// //  * Login.jsx
// //  * Owner: Ryan
// //  * Description: Page for user login.


// import React from 'react';
// //TODO: Import and render LoginForm component
// // - Handle form submission
// // - Redirect on successful login
// // import VersionCompare from '../components/deliverables/VersionCompare';
// // import FeedbackForm from '../components/deliverables/FeedbackForm';
// // import CloudinaryUpload from '../components/deliverables/CloudinaryUpload';
// // // import DeliverableDetail from './DeliverableDetail';

// // function Login() {
// //   return (
// //     <div>
// //       <h1>Login Page</h1>
// //       {/* <LoginForm /> will go here once implemented */}
// //       <VersionCompare />
// //       {/* <DeliverableDetail /> */}
// //       <FeedbackForm />
// //       <CloudinaryUpload />
// //     </div>
// //   );
// // }

// // export default Login;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the login function from AuthContext
      await login(formData.email, formData.password);
      
      // Redirect based on user role (this will be handled by AuthContext)
      // The AuthContext will set the user and redirect appropriately
      
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to ReelBrief</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;