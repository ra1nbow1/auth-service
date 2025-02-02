import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export const ThemeToggle = () => {
    // Состояние для отслеживания текущей темы
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Эффект для установки темы при монтировании компонента
    useEffect(() => {
        // Получаем сохранённую тему из localStorage
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            // Добавляем класс 'dark' к элементу <html> для применения тёмной темы
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            // Удаляем класс 'dark' для светлой темы
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            // Сохраняем выбор светлой темы в localStorage
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            // Сохраняем выбор тёмной темы в localStorage
            localStorage.setItem('theme', 'dark');
        }
        // Обновляем состояние темы
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="fixed top-4 right-4 flex flex-col justify-center space-y-2 mr-5 mt-5">
            <span className="text-sm text-foreground">Тема</span>
            <Switch
                className="bg-background text-foreground border border-border transform scale-150"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
            />
        </div>
    );
};
