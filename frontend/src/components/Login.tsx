import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    return username.trim().length > 0 && password.trim().length > 0;
  }, [username, password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError('Please enter username and password');
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, the API would return user role information
      // For now, we'll simulate this with the existing logic
      await api.login({ email: username, password });

      // Route mapping by role/org keywords
      const u = username.trim().toLowerCase();
      if (u === 'exporter') {
        navigate('/exporter', { replace: true });
        return;
      }

      // Map known org usernames to approver org keys
      const orgMap: Record<string, string> = {
        nbe: 'national-bank',
        customs: 'customs',
        quality: 'coffee-authority',
        bank: 'exporter-bank',
      };
      
      const org = orgMap[u] || 'national-bank';
      
      // Redirect to role-specific dashboard
      switch(org) {
        case 'national-bank':
          navigate('/dashboard/national-bank', { replace: true });
          break;
        case 'customs':
          navigate('/dashboard/customs', { replace: true });
          break;
        case 'coffee-authority':
          navigate('/dashboard/coffee-authority', { replace: true });
          break;
        case 'exporter-bank':
          navigate('/dashboard/exporter-bank', { replace: true });
          break;
        default:
          navigate('/dashboard/national-bank', { replace: true });
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-800 via-purple-800/30 to-dark-700 relative overflow-hidden">
      {/* Blockchain Network Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-gold-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-gold-500 rounded-full animate-pulse delay-700"></div>
        
        {/* Network Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M100,200 Q300,100 500,300 T900,200" stroke="url(#networkGradient)" strokeWidth="1" fill="none" className="animate-pulse" />
          <path d="M200,400 Q400,300 600,500 T1000,400" stroke="url(#networkGradient)" strokeWidth="1" fill="none" className="animate-pulse delay-300" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-gold-500 flex items-center justify-center shadow-2xl">
                  {/* Blockchain Icon */}
                  <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="m5 21 14-14" />
                    <path d="m21 5-14 14" />
                  </svg>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 to-gold-500 blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-200 via-gold-300 to-purple-300 bg-clip-text text-transparent mb-3 drop-shadow-sm">
              Coffee Export Consortium
            </h1>
            <p className="text-gold-100 text-lg font-semibold drop-shadow-sm">Blockchain-Secured Trade Network</p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-gold-300 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-gold-200 text-sm font-medium">Network Status: </span>
              <span className="text-gold-300 text-sm font-bold">Connected</span>
            </div>
          </div>

          {/* Login Card with Glassmorphism */}
          <div className="backdrop-blur-xl bg-white/15 border border-white/25 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-gold-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-6">
                  <Lock className="h-8 w-8 text-gold-400" />
                </div>
                <h2 className="text-3xl font-bold text-gold-100 mb-2 drop-shadow-sm">Secure Access</h2>
                <p className="text-gold-200 font-medium">Enter your consortium credentials</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-bold text-purple-300">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-gold-100 mb-3 drop-shadow-sm">
                    Organization ID
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your organization identifier"
                      disabled={isLoading}
                      className="w-full px-4 py-4 bg-white/8 border border-white/15 rounded-xl text-gold-50 font-medium placeholder-gold-400/60 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all duration-200 backdrop-blur-sm shadow-inner"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gold-100 mb-3 drop-shadow-sm">
                    Access Key
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your secure access key"
                      disabled={isLoading}
                      className="w-full px-4 py-4 bg-white/8 border border-white/15 rounded-xl text-gold-50 font-medium placeholder-gold-400/60 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all duration-200 backdrop-blur-sm shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gold-400 hover:text-gold-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-gold-500 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-700 hover:via-purple-600 hover:to-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Access Consortium Network
                    </div>
                  )}
                </button>
              </form>

              {/* Demo Credentials with Blockchain Theme */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gold-500/15 to-purple-500/15 rounded-xl border border-gold-500/25 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-gold-200 mb-4 flex items-center drop-shadow-sm">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Consortium Access Credentials
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {[
                    { role: 'Coffee Exporter', id: 'exporter', desc: 'Trade Initiator' },
                    { role: 'National Bank', id: 'nbe', desc: 'License Validator' },
                    { role: 'Quality Authority', id: 'quality', desc: 'Quality Certifier' },
                    { role: 'Customs Authority', id: 'customs', desc: 'Export Approver' },
                    { role: 'Exporter Bank', id: 'bank', desc: 'Financial Validator' }
                  ].map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="text-gold-100 font-bold">{org.role}</div>
                        <div className="text-gold-300 text-xs font-medium">{org.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gold-400 font-mono text-sm font-bold">{org.id}</div>
                        <div className="text-purple-300 text-xs font-medium">password</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;