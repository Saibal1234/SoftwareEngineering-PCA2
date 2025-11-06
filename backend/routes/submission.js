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

// submit assignment (student)
router.post('/:assignmentId', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students' });
  const assignment = await models.Assignment.findByPk(req.params.assignmentId);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  const submission = await models.Submission.create({
    filename: req.file.filename,
    originalname: req.file.originalname,
    AssignmentId: assignment.id,
    studentId: req.user.id
  });
  res.json(submission);
});

// list submissions for an assignment (instructor)
router.get('/:assignmentId', auth, async (req, res) => {
  // instructors or admins can view
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const subs = await models.Submission.findAll({
    where: { AssignmentId: req.params.assignmentId },
    include: [{ model: models.User, as: 'student', attributes: ['id','name','email'] }]
  });
  res.json(subs);
});

module.exports = router;
