import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/tasks/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                <h1 className="text-4xl font-bold text-blue-600 tracking-tight">Team Task Manager</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm md:text-base">Welcome, <span className="font-bold text-gray-900">{user?.name}</span> <span className="px-2 py-1 bg-gray-100 rounded-md text-xs ml-1 border border-gray-200">{user?.role}</span></span>
                    <button onClick={logout} className="px-5 py-2 text-sm font-semibold bg-white text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all">Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Projects</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-900 group-hover:scale-105 transition-transform origin-left">{stats.totalProjects}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Tasks</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-900 group-hover:scale-105 transition-transform origin-left">{stats.totalTasks}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Completed Tasks</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-900 group-hover:scale-105 transition-transform origin-left">{stats.completedTasks}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Tasks</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-900 group-hover:scale-105 transition-transform origin-left">{stats.pendingTasks}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">Get Started</h2>
                    <p className="text-gray-500 max-w-xl">Head over to the Projects section to manage team assignments and track task progress across your entire organization.</p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link to="/projects" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-md transition-all">View Projects</Link>
                        {user?.role === 'Admin' && (
                            <Link to="/projects" className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold shadow-sm transition-all">Manage Projects</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
