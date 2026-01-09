import { URLS } from "../config/URLConfig";
export async function refreshToken(){
  const http_url = URLS.HTTP_URL;
    const res = await fetch(`${http_url}/api/user/refresh`,{
        method:"POST",
        credentials:"include"
    })
    if(!res.ok) return null;
    const data = await res.json();
    console.log(data);
    localStorage.setItem("Token",data.newAccessToken);
    return data.token;
}
export async function api(path: string, options:RequestInit = {}) {
    //@ts-ignore
  const accessToken = window.__accessToken;
  const http_url = URLS.HTTP_URL;
  const res = await fetch(`${http_url}/api` + path, {
    ...options,
    headers: { 
      ...(options.headers || {}),
      "Authorization": "Bearer " + accessToken
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
