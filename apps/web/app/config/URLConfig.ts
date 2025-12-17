function getCred(name:string){
    if(!name){
        return;
    }
    const cred = process.env[name];
    return cred;
}
export const URLS={
    WS_URL : getCred("WS_URL"),
    HTTP_URL : getCred("HTTP_URL")
}