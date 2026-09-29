const Job = require('../models/Job');

const sampleJobs = [
  {
    title: 'Node.js Developer Intern',
    company: 'Potenz Technology',
    location: 'Ahmedabad, Gujarat',
    type: 'Internship',
    description: 'Build and maintain REST APIs using Node.js and Express while learning production backend practices.',
    requirements: ['JavaScript (ES6+)', 'Node.js and Express basics', 'MongoDB or SQL basics', 'Git'],
    salary: 'Stipend based',
  },
  {
    title: 'Backend Developer',
    company: 'CloudNest Solutions',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    description: 'Design scalable services, write clean APIs and work with databases, queues and caching layers.',
    requirements: ['2+ years Node.js', 'REST API design', 'MongoDB / PostgreSQL', 'Docker basics'],
    salary: '6 - 10 LPA',
  },
  {
    title: 'Full Stack Developer (MERN)',
    company: 'PixelCraft Labs',
    location: 'Remote',
    type: 'Full-time',
    description: 'Own features end to end across React front end and Node.js back end.',
    requirements: ['React', 'Node.js / Express', 'MongoDB', 'JWT authentication'],
    salary: '5 - 9 LPA',
  },
  {
    title: 'Frontend Developer Intern',
    company: 'BrightWave Digital',
    location: 'Pune, Maharashtra',
    type: 'Internship',
    description: 'Work with designers to turn Figma designs into responsive React interfaces.',
    requirements: ['HTML, CSS, JavaScript', 'React basics', 'Responsive design'],
    salary: 'Stipend based',
  },
  {
    title: 'API Integration Engineer',
    company: 'DataBridge Systems',
    location: 'Hyderabad, Telangana',
    type: 'Contract',
    description: 'Integrate third-party APIs, build webhooks and keep integrations reliable and documented.',
    requirements: ['REST and webhooks', 'Node.js', 'Postman', 'Good documentation habits'],
    salary: 'Contract based',
  },
  {
    title: 'Software Engineer Trainee',
    company: 'InnoSoft Technologies',
    location: 'Ahmedabad, Gujarat',
    type: 'Full-time',
    description: 'Join a trainee program covering full-stack development, testing and code reviews.',
    requirements: ['Any programming language', 'Data structures basics', 'Willingness to learn'],
    salary: '3 - 4 LPA',
  },
];

const seedJobsIfEmpty = async () => {
  const count = await Job.countDocuments();
  if (count > 0) return 0;
  await Job.insertMany(sampleJobs);
  console.log(`Seeded ${sampleJobs.length} sample jobs`);
  return sampleJobs.length;
};

module.exports = { sampleJobs, seedJobsIfEmpty };
