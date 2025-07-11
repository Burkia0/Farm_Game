'use client';

import { useEffect, useState } from 'react';
import './GamePage.css';

type Plot = {
  type: string;
  plantedAt: number;
};

export default function GamePage({ name }: { name: string }) {
    const [showWelcome, setShowWelcome] = useState(true);
    const [field, setField] = useState<(null | Plot)[]>(Array(16).fill(null));

    useEffect(() => {
        const timer = setTimeout(() => {
        setShowWelcome(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handlePlotClick = (index: number) => {
        if (field[index]) return;
        const newField = [...field];
        newField[index] = {
            type: 'Daisy',
            plantedAt: Date.now(),
        };
        setField(newField);
    };

    return (
    <div className="game-wrapper">
        {showWelcome && <h1 className="welcome">Hoş geldin, {name}!</h1>}

        <div className="field-grid">
            {field.map((plot, i) => (
            <div key={i} className="field" onClick={() => handlePlotClick(i)}>
                {plot?.type === 'Daisy' ? '🌼' : ''}
            </div>
            ))}
        </div>
    </div>
    );
}
