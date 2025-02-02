import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

// Определение схемы валидации с использованием Zod
const loginSchema = z.object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
});

// Определение типа данных формы на основе схемы валидации
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {login} = useAuth(); // Получение функции login из кастомного хука useAuth
    const navigate = useNavigate(); // Хук для  навигации

    // Функция обработки отправки формы
    const onSubmit = async (values: LoginFormValues) => {
        try {
            await login.mutateAsync(values);
            navigate('/profile'); // Перенаправление на страницу профиля после успешного входа
        } catch (error) {
            console.log(error);
        }
    };

    const isLoading = login.status === 'loading'; // Определение состояния загрузки

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div
                className="w-full max-w-md p-8 space-y-6 bg-background text-foreground rounded shadow-md border border-border">
                <h2 className="text-2xl font-bold text-center">Вход в аккаунт</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@mail.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Ваш пароль" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {login.isError && (
                            <p className="text-red-500 text-center">
                                {(login.error as any).response.data.code === 'invalid_credentials' ? 'Неверные данные' : (login.error as Error).message}
                            </p>
                        )}
                        <Button type="submit" className="w-full border border-border cursor-pointer"
                                disabled={isLoading}>
                            {isLoading ? 'Вход...' : 'Войти'}
                        </Button>
                        <div className="flex justify-end">
                            <Link to="/register" className="w-full text-center">Зарегистрироваться</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
