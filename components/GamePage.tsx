'use client';

import { useEffect, useState } from 'react';
import './GamePage.css';


export default function GamePage({ name }: { name: string }) {
    const [showWelcome, setShowWelcome] = useState(true);
    const [field, setField] = useState<(null | any)[]>(Array(16).fill(null));

    useEffect(() => {
        const timer = setTimeout(() => {
        setShowWelcome(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
    <div className="game-wrapper">
        {showWelcome && <h1 className="welcome">Hoş geldin, {name}!</h1>}

        <div className="field-grid">
        {field.map((_, i) => (
            <div key={i} className="field"></div>
        ))}
        </div>
    </div>
    );
}
