const express = require('express');
const db = require('./server/db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ status: 'error', message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).send({ status: 'error', message: 'Server error' });
    if (results.length > 0) {
      return res.send({ status: 'success', user: results[0] });
    }
    res.send({ status: 'error', message: 'Invalid credentials' });
  });
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ status: 'error', message: 'All fields are required' });
  }

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).send({ status: 'error', message: 'Server error' });
    }
    res.send({ status: 'success', message: 'User registered' });
  });
});


// บันทึกข้อมูลการจอง
router.post('/saveBooking', (req, res) => {
  const { userId, movieName, seats, time, date } = req.body;
  
  if (!userId || !movieName || !seats || !time || !date) {
    return res.status(400).send({ status: 'error', message: 'Missing required fields' });
  }

  const query = 'INSERT INTO bookings (user_id, movie_name, seats, time, date) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [userId, movieName, seats, time, date], (err, result) => {
    if (err) {
      console.error('Error during booking:', err);  // เพิ่มบรรทัดนี้เพื่อแสดงข้อผิดพลาด     
      return res.status(500).send({ status: 'error', message: 'Server error' });
    }
    res.send({ status: 'success', message: 'Booking saved successfully' });
  });
});

router.get('/getBookingHistory/:userId', (req, res) => {
  const userId = req.params.userId;  // Get userId from URL params

  const query = 'SELECT * FROM bookings WHERE user_id = ?';  // Query to fetch booking history for the user
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error during fetching booking history:', err);  // Log error for debugging
      return res.status(600).send({ status: 'error', message: 'Server error' });
    }

    // Return the booking history data
    if (results.length === 0) {
      return res.send({ status: 'success', message: 'No bookings found', data: [] });
    }

    res.send({ status: 'success', data: results });
  });
});


module.exports = router;
