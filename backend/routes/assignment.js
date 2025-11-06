// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const { models } = require('../models');

// // create assignment (instructor)
// router.post('/:courseId', auth, async (req, res) => {
//   if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Only instructors' });
//   const { title, description, dueDate } = req.body;
//   const assignment = await models.Assignment.create({
//     title, description, dueDate, CourseId: req.params.courseId
//   });
//   res.json(assignment);
// });

// // list assignments for a course
// router.get('/:courseId', async (req, res) => {
//   const list = await models.Assignment.findAll({ where: { CourseId: req.params.courseId }});
//   res.json(list);
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { models } = require('../models');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

// ✅ Student uploads assignment
router.post('/:courseId/submit', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ message: 'Only students can submit assignments' });

  const courseId = req.params.courseId;
  const userId = req.user.id;

  const submission = await models.AssignmentSubmission.create({
    filename: req.file.filename,
    originalname: req.file.originalname,
    mime: req.file.mimetype,
    CourseId: courseId,
    UserId: userId,
    grade: null // initially ungraded
  });

  res.json({ message: 'Assignment submitted successfully', submission });
});

// ✅ Instructor or student can view submissions
router.get('/:courseId', auth, async (req, res) => {
  const courseId = req.params.courseId;
  const submissions = await models.AssignmentSubmission.findAll({
    where: { CourseId: courseId },
    include: [{ model: models.User, attributes: ['name', 'email'] }]
  });
  res.json(submissions);
});

module.exports = router;
