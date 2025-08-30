import React, { useState } from 'react';
import { 
  Coffee, 
  BusinessCenter, 
  Shield, 
  CheckCircle,
  AccountBalance,
  LocalShipping,
  VerifiedUser,
  Assessment,
  LockOutlined
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Button,
  Alert,
  FormInput as Input,
} from '../components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useAuth, useAuthActions } from '../store';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { login } = useAuthActions();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const isFormValid = () => {
    return username.trim() !== '' && password.trim() !== '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isFormValid()) {
      setError('Please enter username and password');
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);
      // Get user from Zustand store after login
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const stored = JSON.parse(userStr);
        routeToOrganizationDashboard(stored.organization);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const routeToOrganizationDashboard = (organization: string) => {
    const dashboardMap: Record<string, string> = {
      'The Mint': '/nbe',
      'Customs Authority': '/customs',
      'Coffee Quality Authority': '/quality',
      'Exporter Bank': '/bank',
      'Commercial Bank of Ethiopia': '/bank',
      'Coffee Exporters Association': '/exporter',
    };

    const dashboard = dashboardMap[organization] || '/dashboard';
    navigate(dashboard);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Coffee className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Coffee Export Platform
          </h1>
          <p className="text-gray-600">
            Secure consortium network for coffee export management
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <LockOutlined className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
              <p className="text-sm text-gray-600 mt-1">
                Access your organization's dashboard
              </p>
            </div>

            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <LockOutlined className="h-4 w-4" />
                    ) : (
                      <LockOutlined className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div><strong>Exporter:</strong> exporter / password</div>
                <div><strong>NBE Officer:</strong> nbe / password</div>
                <div><strong>Quality Inspector:</strong> quality / password</div>
                <div><strong>Customs Officer:</strong> customs / password</div>
                <div><strong>Bank Officer:</strong> bank / password</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Icons */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by leading organizations</p>
          <div className="flex justify-center space-x-6">
            <div className="flex flex-col items-center">
              <AccountBalance className="h-6 w-6 text-blue-600" />
              <span className="text-xs text-gray-600 mt-1">NBE</span>
            </div>
            <div className="flex flex-col items-center">
              <LocalShipping className="h-6 w-6 text-green-600" />
              <span className="text-xs text-gray-600 mt-1">Customs</span>
            </div>
            <div className="flex flex-col items-center">
              <VerifiedUser className="h-6 w-6 text-purple-600" />
              <span className="text-xs text-gray-600 mt-1">Quality</span>
            </div>
            <div className="flex flex-col items-center">
              <BusinessCenter className="h-6 w-6 text-orange-600" />
              <span className="text-xs text-gray-600 mt-1">Bank</span>
            </div>
            <div className="flex flex-col items-center">
              <Assessment className="h-6 w-6 text-red-600" />
              <span className="text-xs text-gray-600 mt-1">Exporters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;