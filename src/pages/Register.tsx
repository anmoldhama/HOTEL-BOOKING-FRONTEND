// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://hotel-booking-server-qrno.onrender.com/session/register', {
        fullName: { firstName, lastName },
        email,
        password,
        user_type: 'guest',
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded px-10 py-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}
        <input
          type="text"
          placeholder="First Name"
          className="mb-3 w-full px-4 py-2 border border-gray-300 rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="mb-3 w-full px-4 py-2 border border-gray-300 rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full px-4 py-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full px-4 py-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded font-semibold">
          Register
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-green-500 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;