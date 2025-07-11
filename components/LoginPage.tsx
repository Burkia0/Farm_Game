'use client';

import { useState, useEffect } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (name: string) => void;
} 

interface User {
  username: string;
  password: string;
  name: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setError('');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = storedUsers.some((u: User) => u.username === username);
    if (exists) {
      setError('Username already exists');
      return;
    }
    const updatedUsers = [...storedUsers, { username, password, name }];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Account created successfully!');
    resetForm();
    setActiveTab('login');
  };


  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  const storedUsers = localStorage.getItem('users');
  if (!storedUsers) {
    setError('No registered users found');
    return;
  }
  const parsedUsers: User[] = JSON.parse(storedUsers);
  const user = parsedUsers.find((u) => u.username === username);

  if (!user) {
    setError('There is no such username');
    return;
  }

  if (user.password !== password) {
    setError('Password is incorrect');
    return;
  }

  setError('');
  onLogin(user.name);
};


  return (
    <div className="wrapper">
      <div className="tabs">
        <button
          onClick={() => {
            setActiveTab('signup');
            resetForm();
          }}
          className={activeTab === 'signup' ? 'activeTab' : 'tab'}
        >
          Sign Up
        </button>

        <button
          onClick={() => {
            setActiveTab('login');
            resetForm();
          }}
          className={activeTab === 'login' ? 'activeTab' : 'tab'}
        >
          Login
        </button>     
      </div>

      <div className="formContainer">
        {activeTab === 'signup' ? (
          <form className="form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="button">Sign Up</button>
          </form>
        ) : (
          <form className="form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="button">Login</button>
          </form>
        )}
      </div>
    </div>
  );
}