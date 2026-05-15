const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

// Get Recent Activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    res.send(activities);
  } catch (e) {
    res.status(500).send();
  }
});

// Post Activity (Internal use or API)
router.post('/', auth, async (req, res) => {
  try {
    const activity = new Activity({
      ...req.body,
      user: req.user._id
    });
    await activity.save();
    res.status(201).send(activity);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
