"use client"
import { useState } from "react";
import { login } from "../../helper/helper";
import { useRouter } from "next/navigation";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Signing up...");

    const resStr = await login(username, password,"signup");
    if (!resStr) return;

    router.push("/");
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Sign Up
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-black"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-black"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          {message}
        </p>
      </form>
    </div>
  );
}