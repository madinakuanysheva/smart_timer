import React, { useState, useEffect } from 'react';
import './App.css';

const motivationalPhrases = [
  'Ты молодец!',
  'Отличная работа!',
  'Продолжай в том же духе!',
  'Гордимся тобой!',
  'Невероятно круто!'
];

function App() {
  const [name, setName] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedTime, setSelectedTime] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    if (savedName) setName(savedName);

    const savedCount = localStorage.getItem('completedCount');
    if (savedCount) setCompletedCount(Number(savedCount));
  }, []);
  
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsFinished(true);
      setPhrase(
        motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
      );
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      localStorage.setItem('completedCount', newCount);
    }
  
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, completedCount]);

  const handleStart = () => {
    if (name.trim() === '') return;
    setTimeLeft(selectedTime);
    setIsRunning(true);
    setIsFinished(false);
    setPhrase('');
    localStorage.setItem('name', name);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
  };

  const handleFullReset = () => {
    setName('');
    setCompletedCount(0);
    localStorage.clear();
  };

  const progressPercent = ((selectedTime - timeLeft) / selectedTime) * 100;

  return (
    <div className="App" style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>⏳ Реактивный Таймер-Мотиватор</h1>

      <p>✅ Завершено: <strong>{completedCount}</strong></p>

      {!isRunning && !isFinished && (
        <>
          <input
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <br /><br />
          <label>⏱️ Выбери время: </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            style={{ padding: '8px', fontSize: '16px' }}
          >
            <option value={10}>10 сек</option>
            <option value={20}>20 сек</option>
            <option value={30}>30 сек</option>
          </select>
          <br />
          <button
            onClick={handleStart}
            disabled={name.trim() === ''}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Старт таймера
          </button>
        </>
      )}

      {isRunning && (
        <>
          <p style={{ fontSize: '24px', marginTop: '20px' }}>
            {name}, осталось {timeLeft} сек
          </p>
          <div style={{ height: '10px', background: '#eee', margin: '10px 0' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: '#00cc66',
                transition: 'width 1s linear'
              }}
            />
          </div>
        </>
      )}

      {isFinished && (
        <>
          <p style={{ fontSize: '24px', marginTop: '20px' }}>
            Ты справился, {name}! 💪
          </p>
          <p style={{ fontStyle: 'italic', color: 'green' }}>{phrase}</p>
          <div className="emoji-bounce" style={{ fontSize: '40px', marginTop: '20px' }}>
            🎉
          </div>
          <button
            onClick={handleStart}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#ffa500',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Попробовать ещё раз
          </button>
        </>
      )}

      {(isRunning || isFinished) && (
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Сброс
          </button>

          <button
            onClick={handleFullReset}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Сброс всего
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
