// packages/frontend/src/App.tsx

// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthGuard from '@/features/Auth/components/AuthGuard';
import LoginForm from '@/features/Auth/components/LoginForm';
import RegisterForm from '@/features/Auth/components/RegisterForm';
import MainLayout from '@/layout/MainLayout';
// import { useAuthStore } from '@/features/Auth/stores/useAuthStore';
import { useSocket } from './hooks/useSocket';

function App() {
  // const { isAuthenticated } = useAuthStore();
  useSocket();

  return (
    <Router>
      <div className="h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#374151',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
