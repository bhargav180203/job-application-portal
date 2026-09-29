require('dotenv').config({ quiet: true });

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { seedJobsIfEmpty } = require('./src/seed/jobs');

const PORT = process.env.PORT || 5000;

const start = async () => {
  const missing = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  await connectDB();
  await seedJobsIfEmpty();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
