export async function refreshToken(){
    const res = await fetch('http://localhost:5000/api/user/refresh',{
        method:"POST",
        credentials:"include"
    })
    if(!res.ok) return null;
     
    const data = await res.json();
    //@ts-ignore
    window.__accessToken=data.token;
    return data.token;
}
export async function api(path: string, options:RequestInit = {}) {
    //@ts-ignore
  const accessToken = window.__accessToken;

  const res = await fetch("http://localhost:5000/api" + path, {
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
