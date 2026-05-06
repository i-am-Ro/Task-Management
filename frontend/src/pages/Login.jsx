import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert('Login failed. Please check credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-blue-600">Welcome Back</h2>
                    <p className="text-gray-500 mt-2 text-sm">Sign in to continue to Team Task Manager</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/30">Sign In</button>
                </form>
                <p className="text-sm text-center text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">Create one</Link></p>
            </div>
        </div>
    );
};

export default Login;
