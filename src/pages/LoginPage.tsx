import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

const loginSchema = z.object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { login } = useAuth();
    const navigate = useNavigate();


    const onSubmit = async (values: LoginFormValues) => {
        try {
            await login.mutateAsync(values);
            navigate('/profile');
        } catch (error) {
            console.log(error)
        }
    };

    const isLoading = login.status === 'loading';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Вход в аккаунт</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@mail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Ваш пароль" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {login.isError && (
                            <p className="text-red-500 text-center">
                                {(login.error as any).response.data.code == 'invalid_credentials' ? 'Неверные данные' : (login.error as Error).message}

                            </p>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Вход...' : 'Войти'}
                        </Button>
                        <div>
                            <Link to="/register" className="w-full text-center" >Зарегистрироваться</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
