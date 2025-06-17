// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const quizRoutes = require('./routes/quiz.routes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/quiz', quizRoutes);

// // Health check
// app.get('/', (req, res) => res.send('PDF to Quiz API is running'));

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Server error');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const quizRoutes = require('./routes/quiz.routes');

const app = express();

// Ensure uploads directory exists on startup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
} else {
  console.log('Uploads directory exists:', uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/', (req, res) => {
  const uploadsExists = fs.existsSync(uploadsDir);
  res.json({
    message: 'PDF to Quiz API is running',
    uploadsDirectory: uploadsDir,
    uploadsExists,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
