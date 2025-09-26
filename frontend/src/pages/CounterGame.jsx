import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/api';

const CounterGame = () => {
  const [books, setBooks] = useState([]);
  const [userCount, setUserCount] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameActive && timeLeft === 0) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  const startGame = async () => {
    try {
      const data = await bookService.getRandomBooks(15);
      setBooks(data.data);
      setUserCount('');
      setTimeLeft(30);
      setGameActive(true);
      setGameOver(false);
      setMessage('');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
  };

  const checkAnswer = () => {
    if (!userCount) return;

    const correctCount = books.length;
    const userAnswer = parseInt(userCount);

    if (userAnswer === correctCount) {
      setScore(score + 1);
      setMessage('✅ Correct! Well done!');
    } else {
      setMessage(`❌ Incorrect! There were ${correctCount} books.`);
    }

    setUserCount('');
    startGame();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameActive) {
      checkAnswer();
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🔢 Book Counter Game</h1>
        <p>How many books can you count in 30 seconds?</p>
        <Link to="/games/bookshelf" className="btn btn-success">
          Play Bookshelf Game Instead
        </Link>
      </div>

      <div className="game-container">
        <div style={{ 
          background: 'var(--light-card)', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>Score: <strong>{score}</strong></div>
            <div>Time Left: <strong>{timeLeft}s</strong></div>
          </div>
        </div>

        {!gameActive && !gameOver && (
          <button onClick={startGame} className="btn btn-primary">
            Start Game
          </button>
        )}

        {gameActive && (
          <div>
            <div className="game-board">
              {books.map(book => (
                <div key={book._id} className="book-item">
                  <div style={{ 
                    background: '#f0f0f0', 
                    height: '80px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                  }}>
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl} 
                        alt={book.title}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className="book-title">{book.title}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <input
                type="number"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter book count..."
                style={{
                  padding: '10px',
                  fontSize: '18px',
                  width: '200px',
                  textAlign: 'center',
                  marginRight: '1rem'
                }}
              />
              <button onClick={checkAnswer} className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div>
            <h2>Game Over!</h2>
            <p>Your final score: {score}</p>
            <button onClick={startGame} className="btn btn-primary">
              Play Again
            </button>
          </div>
        )}

        {message && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: message.includes('✅') ? '#e8f5e8' : '#ffebee',
            borderRadius: '4px'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterGame;