const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astral-flow-sync');
    console.log('Clearing old data...');
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();

    console.log('Creating demo users...');
    const admin = new User({ name: 'Alex Admin', email: 'alex@example.com', password: 'password123', role: 'admin' });
    const user1 = new User({ name: 'Sarah Chen', email: 'sarah@example.com', password: 'password123' });
    const user2 = new User({ name: 'Marcus Lee', email: 'marcus@example.com', password: 'password123' });
    await Promise.all([admin.save(), user1.save(), user2.save()]);

    console.log('Creating demo project...');
    const project = new Project({
      title: 'Aurora Design System',
      description: 'Modern UI kit for Astral apps',
      owner: admin._id,
      members: [user1._id, user2._id],
      progress: 65
    });
    await project.save();

    console.log('Creating demo tasks...');
    const tasks = [
      { title: 'Hero animation', priority: 'high', status: 'progress', assignees: [user1._id], project: project._id },
      { title: 'Billing integration', priority: 'high', status: 'pending', assignees: [user2._id], project: project._id },
      { title: 'Auth QA', priority: 'medium', status: 'completed', assignees: [admin._id], project: project._id }
    ];
    await Task.insertMany(tasks);

    console.log('Logging activity...');
    await new Activity({ user: user1._id, action: 'started working on', target: 'Hero animation', project: project._id }).save();

    console.log('Seed completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
