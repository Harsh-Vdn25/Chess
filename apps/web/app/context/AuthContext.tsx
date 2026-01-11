import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { refreshToken } from "../helper/api";

interface AuthContextType {
  token: string;
  loading: boolean;
  user: string;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function init() {
      const res = await refreshToken();
      if (res) {
        setUser(res.userId);
        setToken(res.accessToken);
        setLoading(true);
      }
      setLoading(false);
    }
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx){
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return ctx;
}