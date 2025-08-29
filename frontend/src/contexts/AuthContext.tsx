import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Mock authentication - adapted for coffee export platform
      const response = await mockLogin(username, password);
      
      const { token: authToken, user: userData } = response;
      
      setToken(authToken);
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock login function - adapted for coffee export consortium
const mockLogin = async (username: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on username for different validator organizations
  const mockUsers: { [key: string]: { password: string; user: User } } = {
    'nbe.admin': {
      password: 'admin123',
      user: {
        id: 'nbe-admin-001',
        name: 'NBE Administrator',
        role: 'NBE_ADMIN',
        organization: 'National Bank of Ethiopia',
        permissions: [
          'license:create', 'license:read', 'license:update', 'license:delete',
          'declaration:read', 'declaration:approve', 'declaration:reject',
          'compliance:screen', 'compliance:override', 'compliance:freeze',
          'regulatory:all', 'audit:read', 'user:manage'
        ]
      }
    },
    'nbe.officer': {
      password: 'officer123',
      user: {
        id: 'nbe-officer-001',
        name: 'NBE Compliance Officer',
        role: 'NBE_OFFICER',
        organization: 'National Bank of Ethiopia',
        permissions: [
          'license:read', 'declaration:read', 'declaration:approve', 'declaration:reject',
          'compliance:screen', 'audit:read'
        ]
      }
    },
    'customs.validator': {
      password: 'customs123',
      user: {
        id: 'customs-val-001',
        name: 'Customs Validator',
        role: 'CUSTOMS_VALIDATOR',
        organization: 'Customs Authority',
        permissions: [
          'shipping:validate', 'document:review', 'customs:approve', 'audit:read'
        ]
      }
    },
    'quality.inspector': {
      password: 'quality123',
      user: {
        id: 'quality-ins-001',
        name: 'Quality Inspector',
        role: 'QUALITY_INSPECTOR',
        organization: 'Coffee Quality Authority',
        permissions: [
          'quality:inspect', 'certificate:issue', 'quality:approve', 'audit:read'
        ]
      }
    },
    'bank.validator': {
      password: 'bank123',
      user: {
        id: 'bank-val-001',
        name: 'Bank Validator',
        role: 'BANK_VALIDATOR',
        organization: 'Exporter Bank',
        permissions: [
          'invoice:validate', 'payment:process', 'bank:approve', 'audit:read'
        ]
      }
    }
  };

  const userCredentials = mockUsers[username];
  
  if (!userCredentials || userCredentials.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Generate mock JWT token
  const mockToken = `mock.jwt.token.${Date.now()}`;

  return {
    token: mockToken,
    user: userCredentials.user
  };
};