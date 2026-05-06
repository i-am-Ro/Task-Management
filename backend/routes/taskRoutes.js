const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTaskStatus, getDashboardStats } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:id', protect, updateTaskStatus);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
