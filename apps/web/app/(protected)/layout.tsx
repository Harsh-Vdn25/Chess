"use client";

import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
    const {user,loading} = useAuth();
    const router = useRouter();
    if(loading) return <div className="flex justify-center items-center">Loading...</div>;
    
    if(!user){
        router.replace('/signin');
        return null;
    }
    return children;
}
