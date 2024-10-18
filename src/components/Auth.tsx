import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, logout, currentUser, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (currentUser) {
    return (
      <div className="text-right">
        <span className="mr-2">Сайн байна уу, {currentUser.email}</span>
        <span className="mr-2">Role: {userRole}</span>
        <Link to="/profile" className="zoon-button px-4 py-2 rounded-md mr-2">
          Профайл
        </Link>
        {userRole === 'admin' && (
          <Link to="/admin" className="zoon-button px-4 py-2 rounded-md mr-2">
            Admin Panel
          </Link>
        )}
        <button onClick={handleLogout} className="zoon-button px-4 py-2 rounded-md">
          Гарах
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Имэйл хаяг"
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Нууц үг"
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        required
      />
      <button type="submit" className="zoon-button w-full px-4 py-2 rounded-md">
        {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
      </button>
      <p className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-orange-500 hover:underline"
        >
          {isLogin ? 'Бүртгүүлэх' : 'Нэвтрэх'}
        </button>
      </p>
    </form>
  );
};

export default Auth;