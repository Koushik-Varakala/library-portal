import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { borrowService } from '../services/api';

const StudentFormPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const borrowData = {
        bookId,
        studentId: formData.studentId,
        studentDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          year: formData.year
        }
      };

      const result = await borrowService.borrowBook(borrowData);
      
      if (result.success) {
        alert(`Book borrowed successfully! Your token is: ${result.data.token}`);
        navigate('/books');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error borrowing book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Borrow Book</h1>
        <p>Please fill in your details to borrow the book.</p>

        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Student ID *</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Business">Business</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Year *</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Processing...' : 'Borrow Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentFormPage;