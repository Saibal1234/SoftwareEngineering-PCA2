const bcrypt = require('bcrypt');
const { sequelize, models } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: deletes db
  const passwordHash1 = await bcrypt.hash('instructor123', 10);
  const ins = await models.User.create({ name: 'Prof. Chhotan', email: 'instructor@example.com', passwordHash: passwordHash1, role: 'instructor' });

  const passwordHash2 = await bcrypt.hash('student123', 10);
  const stu = await models.User.create({ name: 'Saibal Roy', email: 'student@example.com', passwordHash: passwordHash2, role: 'student' });

  const course = await models.Course.create({ title: 'Software Engineering', description: 'SWE course', instructorId: ins.id });

  console.log('Seed done. Instructor login: instructor@example.com / instructor123');
  console.log('Student login: student@example.com / student123');
  process.exit(0);
}

seed();
