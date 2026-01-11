import { URLS } from "../config/URLConfig";
import { useAuth } from "../context/AuthContext";
export async function refreshToken(){
  const http_url = URLS.HTTP_URL;
    const res = await fetch(`${http_url}/api/user/refresh`,{
        method:"POST",
        credentials:"include"
    })
    if(!res.ok) return null;
    const data = await res.json();
    return data;
}
export async function api(path: string, options:RequestInit = {}) {
  const http_url = URLS.HTTP_URL;
  const {token} = useAuth();
  const res = await fetch(`${http_url}/api` + path, {
    ...options,
    headers: { 
      ...(options.headers || {}),
      "Authorization": "Bearer " + token
    },
    credentials: "include"
  });


  if (res.status === 401) {
    const newToken = await refreshToken();
    if (!newToken) return null;

    return api(path, options);
  }

  return res.json();
}
