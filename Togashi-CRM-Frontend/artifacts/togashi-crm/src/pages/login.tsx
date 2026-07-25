import { useState } from 'react';
import { useLocation } from 'wouter';
import { RefreshCircle } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';

const DEMO_EMAIL = 'admin@togashi.local';
const DEMO_PASSWORD = 'Admin123!';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningIn(true);

    window.setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem('togashi_crm_authenticated', 'true');
        localStorage.setItem(
          'togashi_crm_user',
          JSON.stringify({
            id: 'demo-admin-001',
            name: 'Togashi Administrator',
            email: DEMO_EMAIL,
            role: 'Administrator',
          }),
        );

        toast({
          title: 'Login successful',
          description: 'Welcome to Togashi CRM.',
        });

        setLocation('/');
        return;
      }

      setIsSigningIn(false);

      toast({
        title: 'Login failed',
        description: 'Use the demo email and password shown below.',
        variant: 'destructive',
      });
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F3F8F5]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-[#0F172A] flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent" />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center items-center mb-8">
            <span className="text-4xl font-bold tracking-tight text-white">TOGASHI</span>
            <span className="text-4xl font-bold tracking-tight text-[#16A34A] ml-2">CRM</span>
          </div>

          <p className="text-xl text-slate-300 font-light mb-8">Enterprise operations, refined.</p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-[#1E293B] p-4 rounded-xl">
              <div className="text-[#16A34A] font-bold text-2xl mb-1">98%</div>
              <div className="text-slate-400 text-sm">Faster pipeline updates</div>
            </div>
            <div className="bg-[#1E293B] p-4 rounded-xl">
              <div className="text-[#16A34A] font-bold text-2xl mb-1">3.2x</div>
              <div className="text-slate-400 text-sm">Revenue visibility</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex justify-center items-center">
            <span className="text-3xl font-bold tracking-tight text-[#0F172A]">TOGASHI</span>
            <span className="text-3xl font-bold tracking-tight text-[#16A34A] ml-2">CRM</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
          <p className="text-slate-500 mb-8 text-sm">Welcome back. Please enter your details.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 block">Email</label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 block">Password</label>
                <button type="button"
                  onClick={() => toast({ title: 'Demo mode', description: 'Password recovery will be connected when the backend is added.' })}
                  className="text-sm text-[#16A34A] hover:text-[#15803D] font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <input
                id="password" type="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Enter your password"
              />
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

          <div className="mt-12 bg-emerald-50 rounded-xl p-5">
            <h3 className="text-[#15803D] font-semibold mb-2 text-sm">Demo Access</h3>
            <div className="space-y-1 text-sm text-[#15803D]">
              <div className="flex justify-between gap-4">
                <span className="opacity-80">Email:</span>
                <span className="font-mono bg-white/60 px-2 py-0.5 rounded font-bold">{DEMO_EMAIL}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="opacity-80">Password:</span>
                <span className="font-mono bg-white/60 px-2 py-0.5 rounded font-bold">{DEMO_PASSWORD}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
