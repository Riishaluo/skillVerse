import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './tailwind.css'
import { AuthProvider } from "./context/authContext";


createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
