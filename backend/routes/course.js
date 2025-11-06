const express = require('express');
const router = express.Router();
const { models } = require('../models');
const auth = require('../middleware/auth');

// list all courses
router.get('/', async (req, res) => {
  const courses = await models.Course.findAll({ include: [{ model: models.User, as: 'instructor', attributes: ['id','name','email'] }]});
  res.json(courses);
});

// create course (instructor)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Only instructors' });
  const { title, description } = req.body;
  const c = await models.Course.create({ title, description, instructorId: req.user.id });
  res.json(c);
});

module.exports = router;
