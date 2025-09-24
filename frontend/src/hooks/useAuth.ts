import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  organization: string;
  role: string;
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<User>(token);
        setUser(decodedToken);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUser(null);
      }
    }
  }, []);

  return { user };
};
