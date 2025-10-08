import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... rest of the code remains exactly the same
export const bookService = {
  getBooks: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await api.get(`/books?${params}`);
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  getBooksByGenre: async (genre) => {
    const response = await api.get(`/books/genre/${genre}`);
    return response.data;
  },

  getRandomBooks: async (count = 5) => {
    const response = await api.get(`/books/random/${count}`);
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get('/books/genres/all');
    return response.data;
  },

  searchBooks: async (query) => {
    const response = await api.get(`/books/search/${query}`);
    return response.data;
  }
};

export const studentService = {
  createOrGetStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  getStudentByStudentId: async (studentId) => {
    const response = await api.get(`/students/studentId/${studentId}`);
    return response.data;
  }
};

export const borrowService = {
  borrowBook: async (borrowData) => {
    const response = await api.post('/borrow', borrowData);
    return response.data;
  },

  getActiveBorrows: async () => {
    const response = await api.get('/borrow/active');
    return response.data;
  },

  returnBook: async (borrowId) => {
    const response = await api.put(`/borrow/${borrowId}/return`);
    return response.data;
  }
};

export const waitlistService = {
  addToWaitlist: async (waitlistData) => {
    const response = await api.post('/waitlist', waitlistData);
    return response.data;
  },

  getWaitlistByBook: async (bookId) => {
    const response = await api.get(`/waitlist/book/${bookId}`);
    return response.data;
  },

  removeFromWaitlist: async (waitlistId) => {
    const response = await api.delete(`/waitlist/${waitlistId}`);
    return response.data;
  }
};

export const gameService = {
  saveGameScore: async (scoreData) => {
    const response = await api.post('/games/scores', scoreData);
    return response.data;
  },

  getStudentScores: async (studentId) => {
    const response = await api.get(`/games/scores/student/${studentId}`);
    return response.data;
  },

  getLeaderboard: async (gameType) => {
    const response = await api.get(`/games/leaderboard/${gameType}`);
    return response.data;
  }
};

export default api;
