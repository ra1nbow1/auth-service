import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';


const API_URL = 'https://backend-ashen-seven-22.vercel.app';


interface AuthResponse {
    token: string;
}

interface UserProfile {
    email: string;
    id: string;
}

export const useAuth = () => {

    const queryClient = useQueryClient();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const register = useMutation<AuthResponse, Error, { email: string; password: string }>({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_URL}/register`, data);
            return response.data;
        },
        onSuccess: (data) => {
            setToken(data.token);
            localStorage.setItem('token', data.token);
        },
    });

    const login = useMutation<AuthResponse, Error, { email: string; password: string }>({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_URL}/login`, data);
            return response.data;
        },
        onSuccess: (data) => {
            setToken(data.token);
            localStorage.setItem('token', data.token);
        },
    });

    const logout = () => {

        setToken(null);
        localStorage.removeItem('token');
        queryClient.clear();
    };

    const getProfile = useQuery<UserProfile, Error>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            return response.data;
        },
        enabled: !!token,
    });

    return {register, login, logout, getProfile, token};
};
