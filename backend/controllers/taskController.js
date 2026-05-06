const Task = require('../models/Task');

const createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        task.status = req.body.status || task.status;
        if (req.body.progressNote !== undefined) {
            task.progressNote = req.body.progressNote;
        }
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const adminProjects = await require('../models/Project').find({
            $or: [{ owner: req.user._id }, { members: req.user._id }]
        });
        const totalProjects = adminProjects.length;
        
        let myTasks;
        if (req.user.role === 'Admin') {
            const projectIds = adminProjects.map(p => p._id);
            myTasks = await Task.find({ project: { $in: projectIds } });
        } else {
            myTasks = await Task.find({ assignedTo: req.user._id });
        }
        
        const totalTasks = myTasks.length;
        const completedTasks = myTasks.filter(t => t.status === 'Done').length;
        const pendingTasks = myTasks.filter(t => t.status !== 'Done').length;

        res.json({ totalProjects, totalTasks, completedTasks, pendingTasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, getDashboardStats };
