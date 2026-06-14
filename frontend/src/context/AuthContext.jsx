import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", {
            email,
            password,
        });

        localStorage.setItem("token", data.token);

        setUser(data.user);

        return data;
    };

    const register = async (payload) => {
        const { data } = await api.post("/auth/register", payload);

        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);   