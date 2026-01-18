"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const playPage = pathname === "/play";

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <header className="h-14 bg-gray-800 flex items-center justify-between  border-white border-b-1 px-6">
        <h1 className="text-white font-semibold text-lg">Chess Game</h1>

        {/* menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="text-white text-2xl px-2 border border-gray-600"
          >
            ≡
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-600">
              {!playPage && (
                <div
                  className="px-4 py-2 text-white cursor-pointer hover:bg-green-600"
                  onClick={() => {
                    setOpen(false);
                    router.push("/play");
                  }}
                >
                  ← Back
                </div>
              )}

              <div
                className="px-4 py-2 text-white cursor-pointer hover:bg-green-600"
                onClick={() => {
                  setOpen(false);
                  router.push("/profile");
                }}
              >
                Profile
              </div>

              <div
                className="px-4 py-2 text-white cursor-pointer hover:bg-green-600"
                onClick={() => {
                  setOpen(false);
                  logout()
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
