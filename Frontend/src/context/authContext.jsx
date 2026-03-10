// src/context/AuthContext.jsx – Authentication context
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('userInfo');
        if (stored) {
            setAuth(JSON.parse(stored));
        }
    }, []);

    // Login – save user info + token
    const login = (userData) => {

        const authData = {
            token:userData.token,
            user:userData.user
        }
        setAuth(authData);
        localStorage.setItem('userInfo', JSON.stringify(authData));
    };

    // Logout – clear everything
    const logout = () => {
        setAuth(null);
        localStorage.removeItem('userInfo');
    };

    // update user data
    const updateUser = (updatedData) => {
        const stored = JSON.parse(localStorage.getItem('userInfo')) || {};
         const merged = {
        ...stored,
        user: {
            ...stored.user,
            ...updatedData,
        },
    };
        setAuth(merged);
        localStorage.setItem('userInfo', JSON.stringify(merged));
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout , updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
