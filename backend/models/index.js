const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), allowNull: false }
});

const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});

const Material = sequelize.define('Material', {
  filename: { type: DataTypes.STRING, allowNull: false },
  originalname: { type: DataTypes.STRING },
  mime: { type: DataTypes.STRING }
});

const Assignment = sequelize.define('Assignment', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  dueDate: { type: DataTypes.DATE }
});

const Submission = sequelize.define('Submission', {
  filename: { type: DataTypes.STRING, allowNull: false },
  originalname: { type: DataTypes.STRING },
  submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Grade = sequelize.define('Grade', {
  marks: { type: DataTypes.FLOAT },
  feedback: { type: DataTypes.TEXT }
});

// Relationships
User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructorId' });

Course.hasMany(Material);
Material.belongsTo(Course);

Course.hasMany(Assignment);
Assignment.belongsTo(Course);

Assignment.hasMany(Submission);
Submission.belongsTo(Assignment);

User.hasMany(Submission);
Submission.belongsTo(User, { as: 'student' });

Submission.hasOne(Grade);
Grade.belongsTo(Submission);

module.exports = {
  sequelize,
  models: { User, Course, Material, Assignment, Submission, Grade }
};
