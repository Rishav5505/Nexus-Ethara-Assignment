const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/astral-flow-sync').then(async () => {
  const User = require('./models/User');
  const Project = require('./models/Project');

  const alex = await User.findOne({ email: 'alex@example.com' });
  const sarah = await User.findOne({ email: 'sarah@example.com' });

  if (!alex) {
    console.log("Alex user not found. Please login as Alex first.");
    process.exit(1);
  }

  // Clear existing projects to avoid duplicates
  await Project.deleteMany({});

  const sampleProjects = [
    {
      title: "Aurora — Marketing Site",
      description: "Q4 brand relaunch with new hero visuals, dynamic pricing tables, and SEO optimization.",
      status: "active",
      progress: 68,
      owner: alex._id,
      members: [sarah._id],
      due: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    },
    {
      title: "Atlas — Mobile App v2.0",
      description: "Complete rewrite of iOS & Android apps with React Native. Offline mode and dark theme integration.",
      status: "active",
      progress: 34,
      owner: alex._id,
      members: [sarah._id, alex._id],
      due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    {
      title: "Helios — Design System",
      description: "Migration of all legacy design tokens. Implementing new glassmorphism UI components across the workspace.",
      status: "review",
      progress: 91,
      owner: alex._id,
      members: [],
      due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
    },
    {
      title: "Nimbus — API Gateway",
      description: "GraphQL migration, rate limiting implementation, and Redis caching layer for the new microservices architecture.",
      status: "planning",
      progress: 12,
      owner: alex._id,
      members: [sarah._id],
      due: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
    },
    {
      title: "Orion — Data Analytics",
      description: "Self-serve dashboards and insights platform. Integrating Snowflake data warehouse with Metabase.",
      status: "active",
      progress: 78,
      owner: alex._id,
      members: [alex._id],
      due: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days
    }
  ];

  await Project.insertMany(sampleProjects);
  console.log('5 Premium Projects seeded successfully!');
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
