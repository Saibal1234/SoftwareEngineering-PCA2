const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { models } = require('../models');

// assign grade to a submission (instructor)
router.post('/:submissionId', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Only instructors' });
  const { marks, feedback } = req.body;
  const sub = await models.Submission.findByPk(req.params.submissionId);
  if (!sub) return res.status(404).json({ message: 'Submission not found' });
  const grade = await models.Grade.create({ marks, feedback, SubmissionId: sub.id });
  res.json(grade);
});

// get grade for a submission (student/instructor)
router.get('/:submissionId', auth, async (req, res) => {
  const grade = await models.Grade.findOne({ where: { SubmissionId: req.params.submissionId }});
  res.json(grade);
});

module.exports = router;
