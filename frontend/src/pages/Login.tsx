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
      // Prefer context user if available after login; fallback to localStorage
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
    const ORG_HOME: Record<string, string> = {
      'National Bank of Ethiopia': '/nbe',
      'Customs Authority': '/customs',
      'Coffee Quality Authority': '/quality',
      'Exporter Bank': '/bank',
      'Commercial Bank of Ethiopia': '/bank',
      'Coffee Exporters Association': '/exporter',
    };
    navigate(ORG_HOME[organization] || '/dashboard');
  };

  const networkMembers = [
    {
      organization: 'National Bank of Ethiopia',
      credentials: [
        { username: 'nbe.admin', password: 'admin123', role: 'NBE Administrator' },
        { username: 'nbe.officer', password: 'officer123', role: 'NBE Officer' },
      ],
      icon: AccountBalance,
      color: '#1565c0',
      description: 'Central Banking & Regulatory Authority'
    },
    {
      organization: 'Customs Authority',
      credentials: [
        { username: 'customs.validator', password: 'customs123', role: 'Customs Validator' },
        { username: 'customs.supervisor', password: 'supervisor123', role: 'Customs Supervisor' },
      ],
      icon: LocalShipping,
      color: '#2e7d32',
      description: 'Import/Export Documentation & Clearance'
    },
    {
      organization: 'Coffee Quality Authority',
      credentials: [
        { username: 'quality.inspector', password: 'quality123', role: 'Quality Inspector' },
        { username: 'quality.manager', password: 'manager123', role: 'Quality Manager' },
      ],
      icon: VerifiedUser,
      color: '#7b1fa2',
      description: 'Coffee Quality Certification & Standards'
    },
    {
      organization: 'Commercial Banks',
      credentials: [
        { username: 'bank.validator', password: 'bank123', role: 'Bank Validator' },
        { username: 'bank.manager', password: 'manager123', role: 'Bank Manager' },
      ],
      icon: Assessment,
      color: '#f57c00',
      description: 'Trade Finance & Payment Processing'
    },
    {
      organization: 'Coffee Exporters Association',
      credentials: [
        { username: 'exporter.user', password: 'exporter123', role: 'Coffee Exporter' },
      ],
      icon: Coffee,
      color: '#8bc34a',
      description: 'Coffee Export Operations & Management'
    },
  ];

  const [selectedOrgIndex, setSelectedOrgIndex] = useState(0);

  const fillCredentials = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div
        className="min-h-screen flex items-center py-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/coffee-beans.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          {/* Left Side - Branding */}
          <div className="text-white text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <Coffee className="text-5xl mr-4" />
              <h1 className="text-4xl font-bold">
                CoffEx
              </h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ethiopia Coffee Export Platform
            </h2>
            <h3 className="text-xl mb-8 opacity-90">
              Blockchain-secured trade finance and document validation system
            </h3>
            
            {/* Features */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Shield className="mr-4" />
                <span className="text-lg">Secure Multi-party Validation</span>
              </div>
              <div className="flex items-center mb-4">
                <BusinessCenter className="mr-4" />
                <span className="text-lg">Trade Finance Integration</span>
              </div>
              <div className="flex items-center mb-4">
                <CheckCircle className="mr-4" />
                <span className="text-lg">Regulatory Compliance</span>
              </div>
            </div>

            <p className="opacity-80">
              Powered by Hyperledger Fabric Blockchain Technology
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="m-2 bg-primary-600 rounded-full w-14 h-14 flex items-center justify-center">
                    <LockOutlined className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-primary-600">
                    Network Portal
                  </h1>
                  <p className="text-gray-600 text-center">
                    Coffee Export Consortium - Unified Login
                  </p>
                </div>

                {error && (
                  <Alert variant="error" className="mb-4">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <Input
                      required
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-6">
                    <div className="relative">
                      <Input
                        required
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        disabled={isLoading}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={!isFormValid() || isLoading}
                    className="mt-4 w-full"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-600 text-sm">
                    Network Members
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Organization Tabs */}
                <div className="border-b border-gray-200 mb-4">
                  <Tabs 
                    value={selectedOrgIndex.toString()} 
                    onValueChange={(newValue) => setSelectedOrgIndex(parseInt(newValue))}
                  >
                    <TabsList className="w-full grid grid-cols-5">
                      {networkMembers.map((org, index) => {
                        const IconComponent = org.icon;
                        return (
                          <TabsTrigger 
                            key={index}
                            value={index.toString()}
                            className="flex flex-col items-center gap-1 py-2"
                          >
                            <IconComponent className="h-4 w-4" />
                            <span className="text-xs hidden sm:inline">{org.organization.split(' ')[0]}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Selected Organization Details */}
                <div>
                  <div className="p-3 mb-3 rounded-lg border" 
                    style={{ 
                      backgroundColor: networkMembers[selectedOrgIndex].color + '10',
                      borderColor: networkMembers[selectedOrgIndex].color + '30'
                    }}
                  >
                    <h3 className="text-lg font-semibold" 
                      style={{ 
                        color: networkMembers[selectedOrgIndex].color
                      }}
                    >
                      {networkMembers[selectedOrgIndex].organization}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {networkMembers[selectedOrgIndex].description}
                    </p>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto">
                    {networkMembers[selectedOrgIndex].credentials.map((cred, index) => (
                      <div 
                        key={index}
                        className="p-3 mb-2 rounded cursor-pointer border border-transparent hover:border-gray-300"
                        style={{ 
                          backgroundColor: '#f5f5f5',
                        }}
                        onClick={() => fillCredentials(cred.username, cred.password)}
                      >
                        <h4 className="font-medium">
                          {cred.role}
                        </h4>
                        <p className="text-sm font-mono text-gray-600">
                          {cred.username} / {cred.password}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-white text-center mt-4">
              © 2024 Ethiopia Coffee Export Consortium. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;