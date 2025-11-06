const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { models } = require('../models');

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

const router = express.Router();

// upload material (instructor)
router.post('/:courseId/upload', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Only instructors' });
  const courseId = req.params.courseId;
  const course = await models.Course.findByPk(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const file = await models.Material.create({
    filename: req.file.filename,
    originalname: req.file.originalname,
    mime: req.file.mimetype,
    CourseId: courseId
  });
  res.json(file);
});

// list materials for a course
router.get('/:courseId', async (req, res) => {
  const list = await models.Material.findAll({ where: { CourseId: req.params.courseId }});
  res.json(list);
});

module.exports = router;
