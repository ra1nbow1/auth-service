import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeToggle } from '@/components/ThemeToggle.tsx';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <ThemeToggle/>
        <App/>
    </QueryClientProvider>,
)
