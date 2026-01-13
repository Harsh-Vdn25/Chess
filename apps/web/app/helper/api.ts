import { URLS } from "../config/URLConfig";
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
