require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, models } = require('./models');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const materialRoutes = require('./routes/material');
const assignmentRoutes = require('./routes/assignment');
const submissionRoutes = require('./routes/submission');
const gradeRoutes = require('./routes/grade');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/grades', gradeRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  await sequelize.sync(); // { force: true } to reset
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
start();
