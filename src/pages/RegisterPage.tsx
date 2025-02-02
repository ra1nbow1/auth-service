import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

// Схема валидации для формы регистрации с использованием Zod
const registerSchema = z.object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
    confirmPassword: z.string().min(6, 'Подтверждение пароля должно содержать не менее 6 символов'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

// Типизация данных формы на основе схемы валидации
type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
    // Инициализация формы с начальными значениями и схемой валидации
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema), // Подключение схемы валидации через zodResolver
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const {register} = useAuth();

    // Определение состояния загрузки на основе статуса мутации
    const isLoading = register.status === 'loading';

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            await register.mutateAsync({
                email: values.email,
                password: values.password,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div
                className="w-full max-w-md p-8 space-y-6 rounded shadow-md bg-background text-foreground border border-border">
                <Helmet>
                    <title>Auth Service • Регистрация</title>
                </Helmet>
                <h2 className="text-2xl font-bold text-center">Регистрация</h2>
                <Form {... form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@mail.com" {... field} />
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
                                        <Input type="password" placeholder="Ваш пароль" {... field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Подтверждение пароля</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Повторите пароль" {... field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {register.isError && (
                            <p className="text-red-500 text-center">
                                {(register.error as Error).message}
                            </p>
                        )}
                        <Button type="submit" className="w-full border border-border cursor-pointer"
                                disabled={isLoading}>
                            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                        <div className="flex justify-end">
                            <Link to="/login" className="w-full text-center">Войти</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
