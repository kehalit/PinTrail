import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      const { access_token, user } = response.data;
      //localStorage.setItem('access_token', access_token);
      //console.log('User received from backend:', response.data.user);
      login(user, access_token);
      navigate('/dashboard');
      setErrorMsg('')
    }
    catch (err) {
      console.error('Login error:', err); 
      console.log('Full error response:', err.response); 
      setErrorMsg(err.response?.data?.message || 'Login Failed');
    }
    

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 dark:bg-gray-900 text-black dark:text-white">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4 dark:bg-gray-900 text-black dark:text-white"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Sign In</h2>

        {errorMsg && (
          <div className="text-red-600 text-sm text-center">{errorMsg}</div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-900 text-black dark:text-white"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
