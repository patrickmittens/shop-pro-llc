const express = require('express');
const path = require('path');
const { addInquiry, getAllInquiries } = require('./store');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/contact', (req, res) => {
  const { name, company, email, category, message, website } = req.body || {};

  // Honeypot: a hidden field real visitors never fill in. If it's set, the
  // submission is almost certainly automated, so we accept it silently
  // without storing it (no point telling a bot it was caught).
  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  try {
    addInquiry({ name, company, email, category, message });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to save inquiry:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
});

// Lightweight protected view of stored submissions.
// Visit /api/submissions?key=YOUR_ADMIN_KEY
app.get('/api/submissions', (req, res) => {
  const adminKey = process.env.ADMIN_KEY || 'changeme';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  return res.json({ success: true, data: getAllInquiries() });
});

app.listen(PORT, () => {
  console.log(`Shop Pro LLC site running at http://localhost:${PORT}`);
});
