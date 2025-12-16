import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface User {
    name?: string;
    given_name?: string;
    email: string;
    phone?: number | undefined;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: { email?: string; password?: string; token?: string; provider?: string }) => Promise<void>;
    signup: (data: {name: string; email: string; password: string; phone: number }) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext(undefined as AuthContextType | undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null as AuthContextType['user']);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const login = useCallback(async (credentials: {email?: string; password?: string; token?: string; provider?: string}) => {
        setLoading(true);
        try {
            let response;
            if (credentials.provider === 'google' && credentials.token) {
                response = await fetch('http://localhost:3000/auth/google', {
                    method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token: credentials.token }),
					credentials: 'include',
				});
			} else {
                response = await fetch('http://localhost:3000/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
					}),
					credentials: 'include',
				});
			}
            const data = await response.json();
            if (!response.ok || data.ok === false || data.success === false) {
				throw new Error(data.error || 'Login failed');
			}

            const userData = data.user || data;

			setUser({
				name: userData.name || userData.given_name,
				given_name: userData.given_name,
				email: userData.email,
                phone: userData.phone,
			});
			setIsAuthenticated(true);
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		} finally {
            setLoading(false);
        }
	}, []);

    const signup = useCallback(async (data: {name: string; email: string; password: string; phone: number}) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
				credentials: 'include',
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Signup failed');
			}        
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
		try {
			await fetch('http://localhost:3000/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});

			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Logout error:', error);
			// Still clear local state even if API call fails
			setUser(null);
			setIsAuthenticated(false);
		} finally {
            setLoading(false);
        }
	}, []);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
			const response = await fetch('http://localhost:3000/auth/me', {
				credentials: 'include',
			});
            const data = await response.json();

			if (response.ok && data.success) {
				setUser({
					name: data.name || data.given_name,
					given_name: data.given_name,
					email: data.email,
                    phone: data.phone,
				});
				setIsAuthenticated(true);
			} else {
                setUser(null);
                setIsAuthenticated(false);
            }
		} catch (error) {
			console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
		} finally {
            setLoading(false);
        }
	}, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    return (
		<AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout, checkAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
