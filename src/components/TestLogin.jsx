// TestLogin.jsx - Simple test component
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TestLogin = () => {
  const { login, user, isAuthenticated, loading, error } = useAuth();
  const [email, setEmail] = useState('alex.designer@demo.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login...');
    
    const result = await login(email, password);
    console.log('Login result:', result);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Login Test</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {isAuthenticated ? (
        <div style={{ color: 'green' }}>
          <h3>Logged In Successfully!</h3>
          <p><strong>User:</strong> {user?.first_name} {user?.last_name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '300px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h4>Debug Info:</h4>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? JSON.stringify(user) : 'None'}</p>
      </div>
    </div>
  );
};

export default TestLogin;