import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="fixed top-4 right-4 flex flex-col justify-center space-y-2 mr-5 mt-5">
            <span className="text-sm text-foreground">Тема</span>
            <Switch className="bg-background text-foreground border border-border transform scale-150"
                    checked={isDarkMode} onCheckedChange={toggleTheme}/>
        </div>
    );
};
