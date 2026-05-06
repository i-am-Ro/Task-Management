import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [newMemberId, setNewMemberId] = useState('');

    // Task form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState('Medium');

    useEffect(() => {
        fetchProjectData();
        if (user?.role === 'Admin') {
            fetchUsers();
        }
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const projRes = await axios.get(`/projects/${id}`);
            setProject(projRes.data);
            const taskRes = await axios.get(`/tasks/project/${id}`);
            setTasks(taskRes.data);
        } catch (error) {
            console.error('Failed to fetch project details');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/auth/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/tasks', { title, description, assignedTo, priority, project: id });
            setTitle('');
            setDescription('');
            setAssignedTo('');
            setPriority('Medium');
            setShowTaskForm(false);
            fetchProjectData();
        } catch (error) {
            alert('Failed to create task');
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`/tasks/${taskId}`, { status: newStatus });
            fetchProjectData();
        } catch (error) {
            alert('Failed to update task status');
        }
    };

    const handleUpdateTaskNote = async (taskId, newNote) => {
        try {
            await axios.put(`/tasks/${taskId}`, { progressNote: newNote });
            fetchProjectData();
        } catch (error) {
            alert('Failed to update task note');
        }
    };

    const handleAddMember = async () => {
        if (!newMemberId) return;
        const updatedMembers = [...project.members.map(m => m._id), newMemberId];
        try {
            await axios.put(`/projects/${id}`, { members: updatedMembers });
            setNewMemberId('');
            setShowMemberForm(false);
            fetchProjectData();
        } catch (error) {
            alert('Failed to add member');
        }
    };

    const handleRemoveMember = async (memberId) => {
        const updatedMembers = project.members.map(m => m._id).filter(mId => mId !== memberId);
        try {
            await axios.put(`/projects/${id}`, { members: updatedMembers });
            fetchProjectData();
        } catch (error) {
            alert('Failed to remove member');
        }
    };

    if (!project) return <div className="min-h-screen bg-gray-50 text-gray-900 p-8 flex items-center justify-center"><div className="animate-pulse text-xl text-blue-600">Loading project details...</div></div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
            <div className="mb-10 flex justify-between items-start border-b border-gray-200 pb-6 relative">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl font-bold text-blue-600 tracking-tight leading-tight">{project.title}</h1>
                    <p className="text-gray-500 mt-3 text-lg leading-relaxed">{project.description || 'No description provided for this project.'}</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <Link to="/projects" className="px-5 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-gray-600">&larr; Back to Projects</Link>
                </div>
            </div>

            <div className="mb-10 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Team Members</h2>
                    {user?.role === 'Admin' && (
                        <button onClick={() => setShowMemberForm(!showMemberForm)} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-sm transition-all text-white">
                            {showMemberForm ? 'Close' : '+ Add Member'}
                        </button>
                    )}
                </div>
                
                {showMemberForm && (
                    <div className="flex gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <select value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900">
                            <option value="">Select a user to add...</option>
                            {users.filter(u => !project.members.find(m => m._id === u._id) && u._id !== project.owner._id).map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                        <button onClick={handleAddMember} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-all shadow-sm">Add to Team</button>
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-sm text-blue-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="font-semibold">{project.owner?.name}</span> <span className="opacity-75 text-xs">(Owner)</span>
                    </span>
                    {project.members.map(member => (
                        <span key={member._id} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
                            {member.name}
                            {user?.role === 'Admin' && (
                                <button onClick={() => handleRemoveMember(member._id)} className="ml-1 text-red-500 hover:text-red-700 font-bold text-lg leading-none focus:outline-none" title="Remove member">&times;</button>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 mt-12">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Project Tasks</h2>
                {user?.role === 'Admin' && (
                    <button onClick={() => setShowTaskForm(!showTaskForm)} className="px-5 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all font-semibold text-white">
                        {showTaskForm ? 'Cancel Task Creation' : '+ Create Task'}
                    </button>
                )}
            </div>

            {showTaskForm && (
                <div className="bg-white border border-gray-200 p-8 rounded-2xl mb-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400" placeholder="What needs to be done?" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400" placeholder="Task details and instructions..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900">
                                <option value="">Unassigned</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900">
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button type="submit" className="px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 font-bold shadow-sm transition-all text-white">Create Task</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { status: 'To Do', color: 'blue' },
                    { status: 'In Progress', color: 'amber' },
                    { status: 'Done', color: 'emerald' }
                ].map(group => (
                    <div key={group.status} className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col h-full shadow-sm">
                        <div className={`mb-5 pb-3 border-b border-${group.color}-200 flex items-center justify-between`}>
                            <h3 className="text-lg font-bold text-gray-900 tracking-wide">{group.status}</h3>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full bg-${group.color}-100 text-${group.color}-800 border border-${group.color}-200`}>
                                {tasks.filter(t => t.status === group.status).length}
                            </span>
                        </div>
                        
                        <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                            {tasks.filter(t => t.status === group.status).map(task => (
                                <div key={task._id} className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                    <h4 className="font-bold text-gray-900 text-base leading-snug mb-1 pr-4">{task.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                                    
                                    <div className="flex justify-between items-center text-xs mb-4">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-gray-200">
                                            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-800">
                                                {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <span className="text-gray-700 font-medium truncate max-w-[80px]">
                                                {task.assignedTo?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</span>
                                            <select 
                                                value={task.status} 
                                                onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                                className="bg-white text-xs text-gray-900 rounded-md px-2 py-1 border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                                                disabled={user?.role !== 'Admin' && task.assignedTo?._id !== user?._id}
                                            >
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
                                        
                                        {task.progressNote && (
                                            <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 mb-3 border border-amber-200 shadow-sm">
                                                <span className="font-bold block text-amber-600 mb-1 text-[10px] uppercase tracking-wider">Progress Update</span> 
                                                {task.progressNote}
                                            </div>
                                        )}
                                        
                                        {(user?.role === 'Admin' || task.assignedTo?._id === user?._id) && (
                                            <div className="relative mt-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Add quick update & press Enter..."
                                                    className="w-full bg-white border border-gray-300 text-xs rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:bg-gray-50 transition-all outline-none"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                                            handleUpdateTaskNote(task._id, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === group.status).length === 0 && (
                                <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                                    <p className="text-sm text-gray-500 font-medium">No tasks yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectDetails;
