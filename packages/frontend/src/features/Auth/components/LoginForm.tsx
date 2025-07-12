// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '@/services/auth.service';
// import { useAuthStore } from '@/store/useAuthStore';

// export default function LoginForm() {
//   const [email, setEmail] = useState('c@c.pl');
//   const [password, setPassword] = useState('123456');
//   const setToken = useAuthStore((s) => s.setToken);
//   const setUser = useAuthStore((s) => s.setUser);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const user = await login({ email, password });
//       setUser(user);
//       setToken(user.token);
//       navigate('/');
//     } catch {
//       alert('Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto space-y-4">
//       <h1 className="text-xl font-bold">Login</h1>
//       <input className="w-full p-2 border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input className="w-full p-2 border" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button className="bg-discord-blurple text-white px-4 py-2 rounded">Login</button>
//     </form>
//   );
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '../stores/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.log('Login error in onSubmit in LoginForm:', error);

      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome back!</h2>
          <p className="mt-2 text-sm text-gray-400">We're so excited to see you again!</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="Enter your email"
              leftIcon={<Mail size={20} />}
              error={errors.email?.message}
            />

            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
