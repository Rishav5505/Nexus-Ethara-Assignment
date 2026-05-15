const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/astral-flow-sync').then(async () => {
  const User = require('./models/User');
  const Project = require('./models/Project');
  const Task = require('./models/Task');

  const alex = await User.findOne({ email: 'alex@example.com' });
  const sarah = await User.findOne({ email: 'sarah@example.com' });

  if (!alex || !sarah) {
    console.log("Users not found.");
    process.exit(1);
  }

  const projects = await Project.find({});
  if (projects.length === 0) {
    console.log("No projects found to link tasks to.");
    process.exit(1);
  }

  // Find projects by name to map tasks
  const aurora = projects.find(p => p.title.includes('Aurora'));
  const atlas = projects.find(p => p.title.includes('Atlas'));
  const helios = projects.find(p => p.title.includes('Helios'));

  // Clear existing tasks
  await Task.deleteMany({});

  const sampleTasks = [
    // Aurora Projects Tasks
    {
      title: "Refactor billing webhooks",
      description: "Move to typed event handlers for Stripe integration.",
      priority: "high",
      status: "pending",
      project: aurora ? aurora._id : projects[0]._id,
      assignees: [alex._id],
      tags: ["backend"],
      due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Pricing page A/B test setup",
      description: "Setup variants for the new Q4 pricing models.",
      priority: "medium",
      status: "pending",
      project: aurora ? aurora._id : projects[0]._id,
      assignees: [alex._id, sarah._id],
      tags: ["growth"],
      due: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Hero animation polish",
      description: "Reduce LCP by 200ms by optimizing the framer-motion sequence.",
      priority: "high",
      status: "progress",
      project: aurora ? aurora._id : projects[0]._id,
      assignees: [sarah._id],
      tags: ["design", "perf"],
      due: new Date()
    },
    
    // Atlas Project Tasks
    {
      title: "OAuth Google integration",
      description: "Implement one-tap login for Android users.",
      priority: "medium",
      status: "progress",
      project: atlas ? atlas._id : projects[0]._id,
      assignees: [alex._id],
      tags: ["auth", "mobile"],
      due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Mobile nav drawer redesign",
      description: "Update the bottom navigation to match the new fluid specs.",
      priority: "low",
      status: "review",
      project: atlas ? atlas._id : projects[0]._id,
      assignees: [sarah._id],
      tags: ["mobile", "ui"],
      due: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    
    // Helios Project Tasks
    {
      title: "Color tokens migration",
      description: "Migrate all hardcoded hex values to the new CSS variables.",
      priority: "high",
      status: "completed",
      project: helios ? helios._id : projects[0]._id,
      assignees: [sarah._id, alex._id],
      tags: ["design-system"],
      due: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Auth flow QA pass",
      description: "Run automated E2E Cypress tests on the new login flow.",
      priority: "medium",
      status: "completed",
      project: helios ? helios._id : projects[0]._id,
      assignees: [alex._id],
      tags: ["qa"],
      due: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Empty states for analytics",
      description: "Design illustrations for zero-data states in the dashboard.",
      priority: "low",
      status: "pending",
      project: helios ? helios._id : projects[0]._id,
      assignees: [sarah._id],
      tags: ["design", "ux"],
      due: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Onboarding tooltips copy",
      description: "Write microcopy for the new user product tour.",
      priority: "medium",
      status: "review",
      project: helios ? helios._id : projects[0]._id,
      assignees: [sarah._id],
      tags: ["copy", "product"],
      due: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    }
  ];

  await Task.insertMany(sampleTasks);
  console.log('Premium Tasks seeded successfully!');
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
