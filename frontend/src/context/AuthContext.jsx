import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const data = await getCurrentUser();

            if (data?.user) {
                setUser(data.user);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await loginUser(email, password);

        setUser(data.user);

        return data;
    };

    const register = async (
        name,
        email,
        password
    ) => {
        const data = await registerUser(
            name,
            email,
            password
        );

        setUser(data.user);

        return data;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                checkUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}