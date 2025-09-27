"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) { // Only fetch if user is logged in
          const res = await axios.get("/api/auth/me"); // Your backend endpoint
          setUserName(res.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, [user]);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
      <h1 className="font-bold text-lg md:text-xl">Vyom EO Dashboard</h1>
      <div className="flex items-center space-x-6 text-sm md:text-base">
        {user ? (
          <>
            <span className="text-yellow-200 font-medium">
              Welcome, {userName || "User"} 👋
            </span>
            <Link href="/profile" className="hover:text-gray-200 font-medium">
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-gray-200 font-medium">profile</span>
        )}
      </div>
    </nav>
  );
}
