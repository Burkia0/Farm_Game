'use client';

import { useEffect, useState } from 'react';
import './GamePage.css';

type Plot = {
  type: string;
  plantedAt: number;
  level: number;
};

export default function GamePage({ name }: { name: string }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [field, setField] = useState<(null | Plot)[]>(Array(16).fill(null));
  const [selectedMode, setSelectedMode] = useState<'normal' | 'water'>('normal');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
    }, []);

const handlePlotClick = (index: number) => {
    const plot = field[index];

    if (selectedMode === 'water') {
      if (plot && plot.level < 4) {
        const newField = [...field];
        newField[index] = {
          ...plot,
          plantedAt: Date.now() + 3000,
        };
        setField(newField);

        setTimeout(() => {
          setField((prevField) => {
            const current = prevField[index];
            if (current && current.level < 4) {
                const updated = [...prevField];
                updated[index] = {
                ...current,
                level: current.level + 1,
                plantedAt: Date.now(),
                };
                return updated;
            }
            return prevField;
          });
        }, 3000);
      }
      return;
    }

    if (!plot) {
      const newField = [...field];
      newField[index] = {
        type: 'Daisy',
        plantedAt: Date.now(),
        level: 0,
      };
      setField(newField);
    }
  };

  return (
    <div className="game-wrapper">
      {showWelcome && <h1 className="welcome">Hoş geldin, {name}!</h1>}

      <div className="water-can-menu">
        <button
          className={`water-button ${selectedMode === 'water' ? 'selected' : ''}`}
          onClick={() =>
            setSelectedMode(selectedMode === 'water' ? 'normal' : 'water')
          }
        >
          🚿
          <span className="tooltip">Sulama Modu</span>
        </button>
      </div>

      <div className="field-grid">
        {field.map((plot, i) => (
          <div key={i} className="field" onClick={() => handlePlotClick(i)}>
            {plot?.type === 'Daisy' && (
              <span>
                🌼 <small>{plot.level}</small>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
