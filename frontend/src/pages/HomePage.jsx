import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/api';

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [genresData, booksData] = await Promise.all([
        bookService.getGenres(),
        bookService.getRandomBooks(6)
      ]);
      
      setGenres(genresData.data);
      setFeaturedBooks(booksData.data);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">📚 Loading Library...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to Library Portal
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--secondary-color)' }}>
          Discover, Read, and Explore Thousands of Books
        </p>
        <Link to="/books" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
          Explore All Books
        </Link>
      </section>

      <section style={{ margin: '3rem 0' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Featured Books</h2>
        <div className="books-grid">
          {featuredBooks.map(book => (
            <div key={book._id} className="card">
              <h3>{book.title}</h3>
              <p style={{ color: 'var(--secondary-color)', margin: '0.5rem 0' }}>
                by {book.author}
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                Genre: {book.genre}
              </p>
              <Link 
                to={`/books/${book._id}`} 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{ margin: '3rem 0' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Browse by Genre</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {genres.map(genre => (
            <Link 
              key={genre} 
              to={`/books/genre/${genre}`}
              className="btn"
              style={{ 
                background: 'var(--secondary-color)', 
                color: 'white',
                textDecoration: 'none'
              }}
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ margin: '3rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Interactive Games</h2>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/games/bookshelf" className="btn btn-success" style={{ fontSize: '1.1rem' }}>
            🎮 Bookshelf Game
          </Link>
          <Link to="/games/counter" className="btn btn-success" style={{ fontSize: '1.1rem' }}>
            🔢 Counter Game
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;