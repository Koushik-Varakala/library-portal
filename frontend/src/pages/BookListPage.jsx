import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService } from '../services/api';

const BookListPage = () => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, [genre]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      let data;
      if (genre) {
        data = await bookService.getBooksByGenre(genre);
      } else {
        data = await bookService.getBooks();
      }
      setBooks(data.data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">📚 Loading Books...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>
          {genre ? `${genre} Books` : 'All Books'}
          <span style={{ fontSize: '1rem', marginLeft: '1rem', color: 'var(--secondary-color)' }}>
            ({filteredBooks.length} books)
          </span>
        </h1>
        
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '300px'
          }}
        />
      </div>

      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book._id} className="card">
            <h3>{book.title}</h3>
            <p style={{ color: 'var(--secondary-color)', margin: '0.5rem 0' }}>
              by {book.author}
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Genre: {book.genre}
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Available: {book.availableCopies}/{book.totalCopies}
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

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No books found.</p>
          <Link to="/books" className="btn btn-primary">
            View All Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookListPage;