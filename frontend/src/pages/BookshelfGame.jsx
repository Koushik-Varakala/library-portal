import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/api';

const BookshelfGame = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await bookService.getRandomBooks(12);
      setBooks(data.data);
    } catch (error) {
      console.error('Error loading books for game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">🔄 Loading Bookshelf Game...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>📚 Bookshelf Game</h1>
        <p>Click on any book to view details and borrow it!</p>
        <Link to="/games/counter" className="btn btn-success">
          Play Counter Game Instead
        </Link>
      </div>

      <div style={{
        background: '#8B4513',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem'
        }}>
          {books.map(book => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book)}
              style={{
                background: '#DEB887',
                padding: '1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <div style={{ 
                background: '#f0f0f0', 
                height: '100px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
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
              <div style={{ 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {book.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            <p><strong>Available:</strong> {selectedBook.availableCopies}/{selectedBook.totalCopies}</p>
            
            <div style={{ marginTop: '1rem' }}>
              <Link 
                to={`/books/${selectedBook._id}`} 
                className="btn btn-primary"
                style={{ marginRight: '1rem' }}
              >
                View Full Details
              </Link>
              <button 
                onClick={handleCloseDetail}
                className="btn btn-danger"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button onClick={loadBooks} className="btn btn-primary">
          Refresh Bookshelf
        </button>
      </div>
    </div>
  );
};

export default BookshelfGame;