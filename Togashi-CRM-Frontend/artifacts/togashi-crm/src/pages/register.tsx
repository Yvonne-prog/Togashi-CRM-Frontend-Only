import { useState } from 'react';
import { Link } from 'wouter';
import { RefreshCircle, Eye, EyeSlash, TickCircle } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const MOCK_REGISTERED: { email: string }[] = [];

export default function Register() {
  const { toast } = useToast();
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FieldErrors];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: FieldErrors = {};

    if (!form.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    } else if (MOCK_REGISTERED.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      errs.email = 'An account with this email already exists.';
    }

    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    if (!validate()) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      MOCK_REGISTERED.push({ email: form.email.trim().toLowerCase() });
      setIsSubmitting(false);
      setIsSuccess(true);

      toast({
        title: 'Account created successfully.',
        description: 'Access will be enabled by an administrator.',
      });
    }, 800);
  };

  if (isSuccess) {
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
          <div className="w-full max-w-[460px] text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <TickCircle size={36} variant="Bold" color="#16A34A" />
            </div>
            <h2 className="text-[28px] font-bold text-slate-900 mb-2">Account created successfully</h2>
            <p className="text-slate-500 mb-8 text-sm max-w-sm mx-auto">
              Your account has been created. Access will be enabled by an administrator. You will be notified when your account is ready.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Return to Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F3F8F5]">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent" />

        <div className="relative z-10 max-w-md text-center">
          <img
            src="/images/togashi-logo.JPEG"
            alt="Togashi"
            className="h-16 w-auto object-contain mx-auto mb-[14px] rounded-[4px]"
          />
          <p className="text-[26px] font-bold text-white tracking-tight mb-2">Togashi CRM</p>
          <p className="text-base text-slate-400 font-medium">Technology Built for Business Growth.</p>
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

          <h2 className="text-[28px] font-bold text-slate-900 mb-1.5">Create your account</h2>
          <p className="text-slate-500 mb-8 text-sm">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-slate-700 block">Full Name</label>
              <input
                id="fullName" type="text" required autoComplete="name"
                value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.fullName ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-500'}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="regEmail" className="text-sm font-medium text-slate-700 block">Work Email</label>
              <input
                id="regEmail" type="email" required autoComplete="email"
                value={form.email} onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-500'}`}
                placeholder="Enter your work email"
              />
              {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 block">Phone Number <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  id="phone" type="tel" autoComplete="tel"
                  value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="+256 700 000000"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="company" className="text-sm font-medium text-slate-700 block">Company <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  id="company" type="text" autoComplete="organization"
                  value={form.company} onChange={(e) => updateField('company', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="regPassword" className="text-sm font-medium text-slate-700 block">Password</label>
              <div className="relative">
                <input
                  id="regPassword" type={showPassword ? 'text' : 'password'} required autoComplete="new-password"
                  value={form.password} onChange={(e) => updateField('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-500'}`}
                  placeholder="Create a password"
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
              {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 block">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required autoComplete="new-password"
                  value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.confirmPassword ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-500'}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeSlash size={18} variant="Linear" color="currentColor" /> : <Eye size={18} variant="Linear" color="currentColor" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-70 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2">
              {isSubmitting ? (
                <><RefreshCircle className="animate-spin" size={20} /><span>Creating account...</span></>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#16A34A] hover:text-[#15803D] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
