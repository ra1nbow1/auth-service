import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Базовый URL для API запросов
const API_URL = 'https://backend-ashen-seven-22.vercel.app';

interface AuthResponse {
    token: string;
}

interface UserProfile {
    email: string;
    id: string;
}

// Кастомный хук для управления процессом аутентификации
export const useAuth = () => {
    // Инициализация клиента запросов React Query для управления кэшированием данных
    const queryClient = useQueryClient();

    // Состояние для хранения JWT токена; инициализируется значением из localStorage, если оно существует
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    // Мутация для регистрации нового пользователя
    const register = useMutation<AuthResponse, Error, { email: string; password: string }>({
        // Функция, выполняющая POST-запрос на регистрацию
        mutationFn: async (data) => {
            const response = await axios.post(`${API_URL}/register`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // Сохранение полученного токена в состоянии
            setToken(data.token);
            // Сохранение токена в localStorage для сохранения состояния аутентификации между сессиями
            localStorage.setItem('token', data.token);
        },
    });

    // Мутация для входа пользователя
    const login = useMutation<AuthResponse, Error, { email: string; password: string }>({
        // Функция, выполняющая POST-запрос на вход
        mutationFn: async (data) => {
            const response = await axios.post(`${API_URL}/login`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // Сохранение полученного токена в состоянии
            setToken(data.token);
            // Сохранение токена в localStorage для сохранения состояния аутентификации между сессиями
            localStorage.setItem('token', data.token);
        },
    });

    // Функция для выхода пользователя из системы
    const logout = () => {
        // Очистка состояния токена
        setToken(null);
        // Удаление токена из localStorage
        localStorage.removeItem('token');
        // Очистка кэша запросов React Query, чтобы удалить потенциально устаревшие данные
        queryClient.clear();
    };

    // Запрос для получения профиля текущего пользователя
    const getProfile = useQuery<UserProfile, Error>({
        // Ключ запроса для кэширования и идентификации
        queryKey: ['profile'],
        // Функция, выполняющая GET-запрос для получения данных профиля
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: {
                    // Добавление токена в заголовок Authorization для аутентификации запроса
                    Authorization: `${token}`,
                },
            });
            return response.data;
        },
        // Запрос выполняется только если токен существует; предотвращает выполнение запроса, если пользователь не аутентифицирован
        enabled: !!token,
    });

    // Возвращение функций и состояния из хука для использования в компонентах
    return {register, login, logout, getProfile, token};
};
