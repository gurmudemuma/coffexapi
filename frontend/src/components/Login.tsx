import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
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
      navigate(`/approvers?org=${encodeURIComponent(org)}`, { replace: true });
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F0FE] to-[#7B2CBF]/10 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-[#7B2CBF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h18" />
              <path d="M3 13h18" />
              <path d="M3 18h18" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#7B2CBF] mb-2">Coffee Export Platform</h1>
          <p className="text-gray-600">Secure consortium network for coffee export management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white shadow-xl rounded-xl">
          <div className="p-6">
            <div className="text-center mb-6">
              <Lock className="h-8 w-8 text-[#7B2CBF] mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
              <p className="text-sm text-gray-600 mt-1">Access your organization's dashboard</p>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] focus:border-[#7B2CBF]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] focus:border-[#7B2CBF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7B2CBF] hover:text-[#5A189A]"
                    disabled={isLoading}
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full bg-[#7B2CBF] hover:bg-[#5A189A] text-white py-2 rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-[#FCF6E3] rounded-lg border border-amber-200">
              <h3 className="text-sm font-medium text-[#B88A05] mb-2">Demo Credentials</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div><strong>Exporter:</strong> exporter / password</div>
                <div><strong>National Bank of Ethiopia:</strong> nbe / password</div>
                <div><strong>Quality Inspector:</strong> quality / password</div>
                <div><strong>Customs Officer:</strong> customs / password</div>
                <div><strong>Bank Officer:</strong> bank / password</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



