// Usage: npm run seed            -> adds sample jobs only if the jobs collection is empty
//        npm run seed -- --reset -> deletes all jobs first, then re-seeds
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/Job');
const { seedJobsIfEmpty } = require('./jobs');

(async () => {
  try {
    await connectDB();
    if (process.argv.includes('--reset')) {
      await Job.deleteMany({});
      console.log('Existing jobs removed');
    }
    const added = await seedJobsIfEmpty();
    if (!added) console.log('Jobs already exist, nothing seeded (use --reset to reseed)');
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
