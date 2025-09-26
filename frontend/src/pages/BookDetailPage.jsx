import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBookById(id);
      setBook(data.data);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = () => {
    navigate(`/borrow/${id}`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">📚 Loading Book Details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Book Not Found</h2>
          <Link to="/books" className="btn btn-primary">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/books" className="btn" style={{ marginBottom: '2rem' }}>
        ← Back to Books
      </Link>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div>
            <div style={{ 
              background: '#f0f0f0', 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {book.imageUrl ? (
                <img 
                  src={book.imageUrl} 
                  alt={book.title} 
                  style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '4px' }}
                />
              ) : (
                <span>📖 No Image</span>
              )}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleBorrow}
                disabled={book.availableCopies === 0}
                style={{ width: '100%' }}
              >
                {book.availableCopies > 0 ? 'Borrow This Book' : 'Not Available'}
              </button>
              
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {book.availableCopies} of {book.totalCopies} copies available
              </p>
            </div>
          </div>

          <div>
            <h1>{book.title}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '1rem' }}>
              by {book.author}
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <span className="btn" style={{ 
                background: '#e0e0e0', 
                color: '#333',
                pointerEvents: 'none'
              }}>
                {book.genre}
              </span>
            </div>

            <p style={{ marginBottom: '1rem' }}>
              <strong>Published:</strong> {book.publishedYear || 'N/A'}
            </p>

            <p style={{ marginBottom: '1rem' }}>
              <strong>ISBN:</strong> {book.isbn || 'N/A'}
            </p>

            <p style={{ marginBottom: '1rem' }}>
              <strong>Location:</strong> {book.location}
            </p>

            <div>
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;