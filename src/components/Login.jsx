import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        console.log('Token => ', response.data);
        if(response.data === "Wrong Password or Email") {

        }
        localStorage.setItem('jwtToken', response.data);
        navigate('/profile');
      } else {
        throw error("Invalid email or password. Please try again")
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md">
        {/* Gradient Box */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-yellow-300 rounded-3xl h-[520px] w-full z-0 shadow-lg"></div>
        {/* Login Form */}
        <div className="relative bg-white rounded-3xl shadow-xl p-8 z-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-500 text-white font-semibold rounded-full shadow-md hover:bg-purple-600 transition-all duration-300"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
