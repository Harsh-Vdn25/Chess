"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { refreshToken } from "../helper/api";
import { inputCheck } from "../helper/inputCheck";
import toast from "react-hot-toast";
import { URLS } from "../config/URLConfig";

interface AuthenticateType {
  username: string;
  password: string;
  type: string;
}
interface AuthContextType {
  token: string;
  loading: boolean;
  user: string;
  authenticate: ({
    username,
    password,
    type,
  }: AuthenticateType) => Promise<void>;
  api:any;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function init() {
      try {
        const res = await refreshToken();
        if (res) {
          setUser(res.username);
          setToken(res.token);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function authenticate({ username, password, type }: AuthenticateType) {
    const check = inputCheck({ username, password });
    if (!check.success) {
      if (check.error?.username?._errors) {
        toast.error(`username ${check.error?.username?._errors}`);
      }
      if (check.error?.password?._errors) {
        toast.error(`password ${check.error?.password?._errors}`);
      }
      return;
    }
    try {
      const res = await fetch(`${URLS.HTTP_URL}/api/user/${type}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(check.data),
      });
      const data = await res.json();
      if (!data.token) {
        toast.error("Authentication failed");
        return;
      }
      const refreshed = await refreshToken();
      if (refreshed) {
        setUser(refreshed.username);
        setToken(refreshed.token);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function api(path: string, options: RequestInit = {}) {
    const http_url = URLS.HTTP_URL;
    const res = await fetch(`${http_url}/api` + path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: "Bearer " + token,
      },
      credentials: "include",
    });

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed.ok) return null;
      setToken(refreshed.token);
      setUser(refreshed.username);
      return api(path, options);
    }
    return res.json();
  }

  return (
    <AuthContext.Provider value={{ token, loading, user, authenticate,api }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
