"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const playPage = pathname === "/play"; //this will throw a true or false and based on this you can navigate window is often undefined as browser API takes time
  useEffect(() => {
    if (!loading && !token) {
      router.replace("/signin");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900">
      <header className="h-14 bg-gray-800 flex items-center justify-between px-6">
        <h1 className="text-white font-semibold text-lg">Chess Game</h1>

        <Button
          onClick={() => {
            router.push(playPage ? "/profile" : "/play")
          }}
        >
          {playPage ? "Profile" : "Back"}
        </Button>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
