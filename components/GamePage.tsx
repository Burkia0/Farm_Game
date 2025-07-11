'use client';

import { useEffect, useState } from 'react';
import './GamePage.css';

type Plot = {
  type: string;
  plantedAt: number;
  level: number;
  dead?: boolean;
};

export default function GamePage({ name }: { name: string }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [field, setField] = useState<(null | Plot)[]>(Array(16).fill(null));
  const [selectedMode, setSelectedMode] = useState<'normal' | 'water'>('normal');
  const [money, setMoney] = useState(100);


useEffect(() => {
    const timer = setTimeout(() => {
        setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
    }, []);

useEffect(() => {
  const interval = setInterval(() => {
    setField((prevField) =>
      prevField.map((plot) => {
        if (
          plot &&
          !plot.dead &&
          plot.level < 4 &&
          Date.now() - plot.plantedAt >= 6000
        ) {
          return { ...plot, dead: true };
        }
        return plot;
      })
    );
  }, 500);
  return () => clearInterval(interval);
}, []);


const handlePlotClick = (index: number) => {
    const plot = field[index];

    if (plot?.dead) {
        const newField = [...field];
        newField[index] = null;
        setField(newField);
        return;
    }

    if (plot && plot.level === 4 && !plot.dead) {
        setMoney((prev) => prev + 9);
        const newField = [...field];
        newField[index] = null; 
        setField(newField);
        return;
    }

    if (selectedMode === 'water') {
      if (plot && plot.level < 4) {
        if (money < 1) return;
        setMoney((prev) => prev - 1);
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
      if (money < 5) return;
      setMoney((prev) => prev - 5);
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

        <div className="top-ui">
        <div className="left-ui">
            <div className="name-bar">👤 {name}</div>
            <div className="balance-bar">💰 ${money}</div>
        </div>
        <div className="right-ui">
            <div className="timer-bar">⏱️ 00:00</div>
            <div className="store-bar">🛒 Store</div>
        </div>
        </div>

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
            <>
                <span className="plot-content">
                🌼 {plot.dead ? 'dead' : plot.level}
                </span>
                {!plot.dead && plot.level < 4 && (
                <div className="circle-timer">
                    <div
                    className="fill"
                    style={{
                        height: `${
                        Math.max(
                            0,
                            100 -
                            ((Date.now() - plot.plantedAt) / 6000) * 100
                        )
                        }%`,
                    }}
                    ></div>
                </div>
                )}
            </>
            )}
        </div>
        ))}
      </div>
    </div>
  );
}
