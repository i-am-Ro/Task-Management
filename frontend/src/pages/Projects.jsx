import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error('Failed to fetch projects');
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/projects', { title, description });
            setTitle('');
            setDescription('');
            setShowForm(false);
            fetchProjects();
        } catch (error) {
            alert('Failed to create project');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                <h1 className="text-4xl font-bold text-blue-600 tracking-tight">Projects</h1>
                <div className="flex items-center gap-4">
                    <Link to="/" className="px-5 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-gray-600">Dashboard</Link>
                    {user?.role === 'Admin' && (
                        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2 text-sm font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all text-white">
                            {showForm ? 'Cancel' : '+ New Project'}
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="bg-white border border-gray-200 p-8 rounded-2xl mb-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Project</h2>
                    <form onSubmit={handleCreateProject} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400" placeholder="E.g., Website Redesign" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400" placeholder="Briefly describe the project goals..."></textarea>
                        </div>
                        <button type="submit" className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 font-semibold shadow-md transition-all text-white">Save Project</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project._id} className="group bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                            <p className="text-gray-500 mb-6 text-sm line-clamp-3 leading-relaxed">{project.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100 mt-auto">
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${project.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <span className="text-gray-600 font-medium">{project.status}</span>
                            </span>
                            <Link to={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-1 transition-transform inline-block">View Details &rarr;</Link>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-2xl bg-white">No projects found. Create one to get started.</div>}
            </div>
        </div>
    );
};

export default Projects;
