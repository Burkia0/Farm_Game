'use client';

import { useState } from 'react';
import LoginPage from '../components/LoginPage';
import GamePage from '../components/GamePage';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');

  return (
    <>
      {isLoggedIn ? (
        <GamePage name={name} />
      ) : (
        <LoginPage onLogin={(n) => {
          setName(n);
          setIsLoggedIn(true);
        }} />
      )}
    </>
  );
}