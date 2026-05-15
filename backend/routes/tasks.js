const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

// Create Task
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: "Only admins can create tasks." });
    }

    const task = new Task({
      ...req.body
    });
    await task.save();
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'created task',
      target: task.title,
      project: task.project
    });

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get Tasks by Project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignees', 'name avatar');
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Task Status/Details
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send();

    const oldStatus = task.status;
    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    // Log activity based on what changed
    let action = 'updated task';
    if (req.body.status) {
      action = `moved task: ${oldStatus} → ${req.body.status}`;
    }
    if (req.body.assignees) action = 'assigned task';

    await Activity.create({
      user: req.user.id || req.user._id,
      action: action,
      target: task.title,
      project: task.project
    });

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get All Tasks
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const allTasks = await Task.find().populate('assignees', 'name avatar');
      return res.send(allTasks);
    }
    const tasks = await Task.find({
      $or: [
        { assignees: req.user._id }
      ]
    }).populate('assignees', 'name avatar');
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'deleted task',
      target: task.title,
      project: task.project
    });

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
