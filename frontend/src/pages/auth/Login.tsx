import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from "@/components/login-form";
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    // If user is already authenticated, redirect to the page they were trying to access
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;