'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

const MOCK_EMAIL = 'marcus.reynolds@itservicedesk.io';
const MOCK_PASSWORD = 'ServiceDesk@2026';

export default function SignUpLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null);

  const loginForm = useForm<LoginForm>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const signupForm = useForm<SignupForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    // Backend integration: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 1200));

    if (data.email === MOCK_EMAIL && data.password === MOCK_PASSWORD) {
      toast.success('Welcome back, Marcus!');
      router.push('/dashboard');
    } else {
      toast.error(`Invalid credentials. Try: ${MOCK_EMAIL} / ${MOCK_PASSWORD}`);
    }
    setIsLoading(false);
  };

  const handleSignup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    // Backend integration: POST /api/auth/register
    await new Promise((r) => setTimeout(r, 1400));
    toast.success('Account created! Please check your email to verify.');
    setTab('login');
    setIsLoading(false);
  };

  const handleSSO = async (provider: 'google' | 'microsoft') => {
    setSsoLoading(provider);
    // Backend integration: GET /api/auth/sso/[provider]
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`${provider === 'google' ? 'Google' : 'Microsoft'} SSO — redirecting...`);
    router.push('/dashboard');
    setSsoLoading(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-indigo-300 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <AppLogo size={40} />
            <span className="text-white font-bold text-xl tracking-tight">ITServiceDesk</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Resolve faster.<br />
            Track smarter.<br />
            <span className="text-blue-200">Stay ahead of SLA.</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Enterprise IT service management built for modern support teams — AI-assisted ticket creation, real-time SLA tracking, and intelligent routing.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Avg. Resolution Time', value: '2.4h', sub: '↓ 18% this quarter' },
            { label: 'SLA Compliance', value: '96.2%', sub: 'Across all priorities' },
            { label: 'Tickets Resolved', value: '48.2k', sub: 'This fiscal year' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-xs font-medium text-blue-100 mt-1">{stat.label}</p>
              <p className="text-xs text-blue-200/70 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={32} />
            <span className="font-bold text-slate-900 text-lg">ITServiceDesk</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
                  tab === t
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
                <p className="text-sm text-slate-500 mt-1">Sign in to your IT Service Desk account</p>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleSSO('google')}
                  disabled={ssoLoading !== null}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
                >
                  {ssoLoading === 'google' ? (
                    <Icon name="Loader2Icon" size={16} className="animate-spin text-slate-500" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Google SSO
                </button>
                <button
                  onClick={() => handleSSO('microsoft')}
                  disabled={ssoLoading !== null}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
                >
                  {ssoLoading === 'microsoft' ? (
                    <Icon name="Loader2Icon" size={16} className="animate-spin text-slate-500" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                  )}
                  Microsoft SSO
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">
                  or sign in with email
                </div>
              </div>

              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    {...loginForm.register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })}
                    placeholder="you@company.com"
                    className="input-field"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                      placeholder="Enter your password"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Icon name={showPassword ? 'EyeOffIcon' : 'EyeIcon'} size={16} />
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...loginForm.register('remember')}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">Remember me for 30 days</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-2.5 text-sm"
                  style={{ minWidth: '100%' }}
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2Icon" size={16} className="animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign In to Service Desk'
                  )}
                </button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <Icon name="InfoIcon" size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 mb-1">Demo Credentials</p>
                    <p className="text-xs text-blue-700 font-mono leading-relaxed">
                      Email: <span className="font-semibold">{MOCK_EMAIL}</span><br />
                      Password: <span className="font-semibold">{MOCK_PASSWORD}</span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
                <p className="text-sm text-slate-500 mt-1">Join your team's IT Service Desk workspace</p>
              </div>

              {/* SSO for signup */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleSSO('google')}
                  disabled={ssoLoading !== null}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
                >
                  {ssoLoading === 'google' ? (
                    <Icon name="Loader2Icon" size={16} className="animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Google
                </button>
                <button
                  onClick={() => handleSSO('microsoft')}
                  disabled={ssoLoading !== null}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
                >
                  {ssoLoading === 'microsoft' ? (
                    <Icon name="Loader2Icon" size={16} className="animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                  )}
                  Microsoft
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">
                  or register with email
                </div>
              </div>

              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      {...signupForm.register('firstName', { required: 'Required' })}
                      placeholder="Marcus"
                      className="input-field"
                    />
                    {signupForm.formState.errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      {...signupForm.register('lastName', { required: 'Required' })}
                      placeholder="Reynolds"
                      className="input-field"
                    />
                    {signupForm.formState.errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email</label>
                  <input
                    type="email"
                    {...signupForm.register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })}
                    placeholder="you@company.com"
                    className="input-field"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                  <select
                    {...signupForm.register('department', { required: 'Select a department' })}
                    className="input-field"
                  >
                    <option value="">Select department…</option>
                    <option>IT Infrastructure</option>
                    <option>IT Security</option>
                    <option>Service Desk</option>
                    <option>Network Operations</option>
                    <option>Software Development</option>
                    <option>End User Support</option>
                  </select>
                  {signupForm.formState.errors.department && (
                    <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...signupForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Minimum 8 characters' },
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                          message: 'Must include uppercase, number, and special character',
                        },
                      })}
                      placeholder="Min. 8 chars, uppercase, number, symbol"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Icon name={showPassword ? 'EyeOffIcon' : 'EyeIcon'} size={16} />
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...signupForm.register('confirmPassword', { required: 'Please confirm your password' })}
                      placeholder="Re-enter password"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Icon name={showConfirmPassword ? 'EyeOffIcon' : 'EyeIcon'} size={16} />
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...signupForm.register('agreeTerms', { required: 'You must accept the terms' })}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{' '}
                    <button type="button" className="text-blue-600 hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>
                  </span>
                </label>
                {signupForm.formState.errors.agreeTerms && (
                  <p className="text-xs text-red-500 -mt-2">{signupForm.formState.errors.agreeTerms.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2Icon" size={16} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              {tab === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}