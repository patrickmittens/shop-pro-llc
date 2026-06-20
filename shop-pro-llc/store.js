const fs = require('fs');
const path = require('path');

// On Render (and similar hosts), persistent storage is a separate "disk"
// mounted at a fixed folder path. We point our data file there when the
// DATA_DIR environment variable is set; otherwise we fall back to a local
// "data" folder next to this file, which is what you'll see when running
// the site on your own computer.
const dataDir = process.env.DATA_DIR
  ? process.env.DATA_DIR
  : path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'inquiries.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
}

function readAll() {
  ensureStore();
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Failed to read inquiries store:', err);
    return [];
  }
}

function addInquiry({ name, company, email, category, message }) {
  ensureStore();
  const all = readAll();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name,
    company: company || '',
    email,
    category: category || '',
    message,
    createdAt: new Date().toISOString()
  };
  all.unshift(entry);
  fs.writeFileSync(dataFile, JSON.stringify(all, null, 2), 'utf8');
  return entry;
}

function getAllInquiries() {
  return readAll();
}

module.exports = { addInquiry, getAllInquiries };
