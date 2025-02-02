import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';


const ProfilePage: React.FC = () => {
    const {getProfile, logout} = useAuth();
    const {data, isLoading, isError, error} = getProfile;
    const navigate = useNavigate();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-4 w-full max-w-md space-y-4 text-center border border-2 border-gray-200 rounded-lg">
                    <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
                    <div className="mb-4 space-y-2">
                        <Skeleton className="w-full h-[19px] rounded-full bg-gray-200"/>
                        <Skeleton className="w-full h-[19px] rounded-full bg-gray-200"/>
                    </div>
                    <Button
                        onClick={logout}
                        className="px-4 py-2 bg-black text-white rounded cursor-pointer border border-white"
                    >
                        Выйти
                    </Button>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-4 w-full max-w-md text-center">
                    <p className="text-red-500">Ошибка: {error.message}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        navigate('/login');
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-4 w-full max-w-md text-center">
                    <p className="text-red-500">Не удалось загрузить данные профиля.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-4 w-full max-w-md space-y-4 text-center border border-2 border-gray-200 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
                <div className="mb-4 space-y-2">
                    <p>
                        <strong>Email:</strong> {data.email}
                    </p>
                    <p>
                        <strong>ID:</strong> {data.id}
                    </p>
                </div>
                <Button
                    onClick={() => {
                        logout();
                        navigate('/')
                    }}
                    className="px-4 py-2 bg-black text-white rounded cursor-pointer border border-white"
                >
                    Выйти
                </Button>
            </div>
        </div>
    );
};

export default ProfilePage;
