/**
 * Login.jsx
 * Owner: Ryan
 * Description: Page for user login.
 */

import React from 'react';
// TODO: Import and render LoginForm component
// // - Handle form submission
// // - Redirect on successful login
// import VersionCompare from '../components/deliverables/VersionCompare';

// function Login() {
//   return (
//     <div>
//       <h1>Login Page</h1>
//       {/* <LoginForm /> will go here once implemented */}
//       <VersionCompare />
//     </div>
//   );
// }

// export default Login;
import VersionCompare from '../components/deliverables/VersionCompare';

function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">Login Page</h1>
          <p className="mt-2 text-center text-gray-600">
            Basic login page - VersionCompare component below
          </p>
        </div>
        
        {/* Simple test to see if anything renders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Area</h2>
          <p>If you can see this, the app is loading.</p>
        </div>

        {/* Test VersionCompare with minimal props */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">VersionCompare Test</h3>
          <VersionCompare versions={[]} />
        </div>
      </div>
    </div>
  );
}

export default Login;