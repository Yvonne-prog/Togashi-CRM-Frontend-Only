import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { RefreshCircle, Eye, EyeSlash } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';

import { supabase } from '@/lib/supabase';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningIn) return;

    setError('');
    setIsSigningIn(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;

      toast({
        title: 'Welcome back',
        description: 'Signed in successfully',
      });

      setLocation('/', { replace: true });
    } catch (err: unknown) {
      setIsSigningIn(false);
      const message = err instanceof Error ? err.message : 'Sign in failed';

      const friendly =
        message.includes('Invalid login credentials')
          ? 'Incorrect email or password.'
          : message.includes('too-many-requests') || message.includes('rate')
          ? 'Too many attempts. Please try again later.'
          : 'Sign in failed. Please check your connection.';

      setError(friendly);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F3F8F5]">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <img
            src="/images/togashi-logo.JPEG"
            alt="Togashi"
            className="h-[172px] w-auto object-contain mb-7 rounded-[4px]"
          />
          <p className="text-[38px] font-bold text-white tracking-tight leading-none mb-3.5">Togashi CRM</p>
          <p className="text-[19px] font-medium text-slate-300/80 max-w-[420px] leading-relaxed">Technology Built for Business Growth.</p>
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-10 lg:hidden text-center">
            <img
              src="/images/togashi-logo.JPEG"
              alt="Togashi"
              className="h-20 w-auto object-contain mx-auto mb-5 rounded-[4px]"
            />
            <p className="text-[32px] font-bold text-slate-900 tracking-tight mb-1">Togashi CRM</p>
            <p className="text-base text-slate-500 font-medium">Technology Built for Business Growth.</p>
          </div>

          <h2 className="text-[28px] font-bold text-slate-900 mb-1.5">Sign in to your account</h2>
          <p className="text-slate-500 mb-8 text-sm">Enter your credentials to continue.</p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 block">Email</label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 block">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} variant="Linear" color="currentColor" /> : <Eye size={18} variant="Linear" color="currentColor" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]/20"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button"
                onClick={() => toast({ title: 'Forgot password', description: 'Use your Supabase project dashboard to reset your password.' })}
                className="text-sm text-[#16A34A] hover:text-[#15803D] font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={isSigningIn}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-70 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              {isSigningIn ? (
                <><RefreshCircle className="animate-spin" size={20} /><span>Signing in...</span></>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#16A34A] hover:text-[#15803D] font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
