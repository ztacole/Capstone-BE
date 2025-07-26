const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/blog_thumbnails', express.static(path.join(__dirname, 'blog_thumbnails')));


// Setup multer untuk upload thumbnail blog
const thumbnailStorage = multer.diskStorage({
  destination: 'blog_thumbnails/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const thumbnailUpload = multer({ storage: thumbnailStorage });

// CREATE blog
app.post('/blogs', thumbnailUpload.single('thumbnail'), (req, res) => {
  const { title, content } = req.body;
  const thumbnail = req.file ? req.file.filename : null;
  const sql = 'INSERT INTO blogs (title, content, thumbnail) VALUES (?, ?, ?)';

  db.query(sql, [title, content, thumbnail], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Blog created', id: result.insertId });
  });
});

// READ semua blog
app.get('/blogs', (req, res) => {
  db.query('SELECT * FROM blogs', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ blog by id
app.get('/blogs/:id', (req, res) => {
  db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

// UPDATE blog
app.put('/blogs/:id', thumbnailUpload.single('thumbnail'), (req, res) => {
  const { title, content } = req.body;
  const thumbnail = req.file ? req.file.filename : null;
  const sql = 'UPDATE blogs SET title = ?, content = ?, thumbnail = ? WHERE id = ?';

  db.query(sql, [title, content, thumbnail, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Blog updated' });
  });
});

// DELETE blog
app.delete('/blogs/:id', (req, res) => {
  db.query('DELETE FROM blogs WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Blog deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});