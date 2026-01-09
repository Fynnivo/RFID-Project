import { useState } from 'react';
import { authService } from '../services/authService';

export default function useAuth() {
    const [user, setUser] = useState(authService.getUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
    };
}