const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

// Get Dashboard Overview Stats
router.get('/overview', auth, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ assignees: req.user._id });
    }

    const stats = {
      totalProjects,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      overdueTasks: tasks.filter(t => t.due && t.due < new Date() && t.status !== 'completed').length
    };

    const recentActivities = await Activity.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const teamMembers = await User.find().select('name avatar role').limit(5);

    res.send({ stats, recentActivities, teamMembers });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Get Team performance for Analytics
router.get('/team-performance', auth, async (req, res) => {
  try {
    const users = await User.find().select('name avatar');
    const performance = await Promise.all(users.map(async (user) => {
      const total = await Task.countDocuments({ assignees: user._id });
      const completed = await Task.countDocuments({ assignees: user._id, status: 'completed' });
      return {
        name: user.name,
        value: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }));
    res.send(performance);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
