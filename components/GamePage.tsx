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
    const [inventory, setInventory] = useState({
     Daisy: 0,
    Rose: 0,
     Tulip: 0,
    });
    const [showStore, setShowStore] = useState(false);

    const handlePurchase = (flower: 'Daisy' | 'Rose' | 'Tulip', price: number) => {
    if (money < price) {
        alert("No enough money!");
        return;
    }

    setMoney((prev) => prev - price);
    setInventory((prev) => ({
        ...prev,
        [flower]: prev[flower] + 1,
    }));
    };


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
    let flowerToPlant: 'Daisy' | 'Rose' | 'Tulip' | null = null;

    if (inventory.Daisy > 0) flowerToPlant = 'Daisy';
    else if (inventory.Rose > 0) flowerToPlant = 'Rose';
    else if (inventory.Tulip > 0) flowerToPlant = 'Tulip';
    else return; 

    const newField = [...field];
    newField[index] = {
        type: flowerToPlant,
        plantedAt: Date.now(),
        level: 0,
    };
    setField(newField);

    setInventory((prev) => ({
        ...prev,
        [flowerToPlant!]: prev[flowerToPlant!] - 1,
    }));

    return;
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
            <div className="store-bar" onClick={() => setShowStore(true)}>
            🛒 Store
            </div>
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
            {plot && (
            <>
                <span className="plot-content">
                {plot.type === 'Daisy' && '🌼'}
                {plot.type === 'Rose' && '🌹'}
                {plot.type === 'Tulip' && '🌷'}{' '}
                {plot.dead ? 'dead' : plot.level}
                </span>

                {!plot.dead && plot.level < 4 && (
                <div className="circle-timer">
                    <div
                    className="fill"
                    style={{
                        height: `${
                        Math.max(
                            0,
                            100 - ((Date.now() - plot.plantedAt) / 6000) * 100
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

        {showStore && (
        <div className="store-popup">
            <h3>🌸 Store</h3>
            <div className="store-item" onClick={() => handlePurchase('Daisy', 5)}>
            🌼 Daisy – $5 (you have: {inventory.Daisy})
            </div>
            <div className="store-item" onClick={() => handlePurchase('Rose', 12)}>
            🌹 Rose – $12 (you have: {inventory.Rose})
            </div>
            <div className="store-item" onClick={() => handlePurchase('Tulip', 20)}>
            🌷 Tulip – $20 (you have: {inventory.Tulip})
            </div>
            <button className="close-btn" onClick={() => setShowStore(false)}>Kapat</button>
        </div>
        )}

    </div>
  );
}
