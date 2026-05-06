import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = 'https://task-management-u5cy.onrender.com/api';
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/auth/me');
                setUser(res.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        setUser(res.data);
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
