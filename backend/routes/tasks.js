const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// 📊 Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user.id });
    const completed = await Task.countDocuments({ user: req.user.id, completed: true });
    const pending = total - completed;
    res.json({ total, completed, pending });
  } catch (err) {
    console.error('Error fetching task stats:', err.message);
    res.status(500).send('Server error');
  }
});

// 📄 Get a task by ID
router.get('/id/:id', auth, async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ msg: 'Invalid task ID' });
  }

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found or unauthorized' });
    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err.message);
    res.status(500).send('Server error');
  }
});

// ➕ Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, dueTime } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: 'Title and description are required' });
    }

    // Ensure dueDate is in Date format (if it's provided)
    const formattedDueDate = dueDate ? new Date(dueDate) : null;  // Converts string to Date or null
    const newTask = new Task({
      title,
      description,
      dueDate: formattedDueDate,  // Store as Date
      dueTime,
      user: req.user.id
    });

    await newTask.save();
    res.json(newTask);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).send('Server error');
  }
});

// ✏️ Update task
router.put('/id/:id', auth, async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ msg: 'Invalid task ID' });
  }

  try {
    const { title, description, dueDate, dueTime } = req.body;

    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found or unauthorized' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);  // Ensure dueDate is a Date object
    if (dueTime !== undefined) task.dueTime = dueTime;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).send('Server error');
  }
});

// ✅ Toggle completed status
router.patch('/:id', auth, async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ msg: 'Invalid task ID' });
  }

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ msg: 'Completed must be boolean' });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id },
      { completed },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: 'Task not found or unauthorized' });

    res.json(task);
  } catch (err) {
    console.error('Error toggling task:', err.message);
    res.status(500).send('Server error');
  }
});

// ❌ Delete a task
router.delete('/id/:id', auth, async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ msg: 'Invalid task ID' });
  }

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found or unauthorized' });

    await task.deleteOne();
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).send('Server error');
  }
});

// 📃 Get all tasks (with optional completion filter)
router.get('/', auth, async (req, res) => {
  const completed = req.query.completed;
  try {
    const filter = { user: req.user.id };
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
