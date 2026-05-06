const Project = require('../models/Project');

const createProject = async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            owner: req.user._id,
            members: req.body.members || [req.user._id]
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        // Find projects where user is owner or member
        const projects = await Project.find({
            $or: [{ owner: req.user._id }, { members: req.user._id }]
        }).populate('owner', 'name email').populate('members', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.status = req.body.status || project.status;
        if (req.body.members) {
            project.members = req.body.members;
        }
        
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, getProjectById, updateProject };
