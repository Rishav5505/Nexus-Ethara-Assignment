const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

// Create Project
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: "Only admins can create projects." });
    }

    const project = new Project({
      ...req.body,
      owner: req.user._id
    });
    await project.save();

    await Activity.create({
      user: req.user._id,
      action: 'created project',
      target: project.name,
      project: project._id
    });

    res.status(201).send(project);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get All Projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name avatar').populate('members', 'name avatar');
    res.send(projects);
  } catch (e) {
    res.status(500).send();
  }
});

// Get Single Project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id
    }).populate('members', 'name avatar');
    if (!project) return res.status(404).send();
    res.send(project);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).send({ error: "Project not found or unauthorized" });

    await Activity.create({
      user: req.user._id,
      action: 'updated project',
      target: project.name,
      project: project._id
    });

    res.send(project);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete Project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!project) return res.status(404).send({ error: "Project not found or unauthorized" });

    await Activity.create({
      user: req.user._id,
      action: 'deleted project',
      target: project.name,
      project: project._id
    });

    res.send(project);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
