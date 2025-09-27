"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Create blinking stars for background
    const generatedStars = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 1.5 + 0.5}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 relative overflow-hidden">
      
      {/* Animated Blinking Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-blue-200 rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Subtle Blue Nebula Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/3 rounded-full blur-3xl opacity-50"></div>

      {/* EO Insights Platform - Very subtle at the top */}
      <div className="absolute top-4 z-10">
        <h1 className="text-xs font-light text-blue-300/70 bg-black/20 px-3 py-1 rounded-full">
          🌍 EO Insights Platform
        </h1>
      </div>

      {/* Logo - Made very small */}
      <div className="mb-2 z-10">
        <Image 
          src="/logo2.png" 
          alt="EO Insights Logo" 
          width={60} 
          height={90} 
          className="rounded-full border border-blue-400/40 shadow-lg shadow-blue-500/20"
        />
      </div>

      {/* Vyom Website Name - Large and clear as main focus */}
      <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-4 tracking-tight z-10">
        VYOM
      </h2>

      {/* Satellite Image Analysis text - Very subtle */}
      <p className="text-blue-300/50 mb-8 text-sm font-extralight tracking-wide z-10">
        Satellite Image Analysis with AI
      </p>
      
      {/* Buttons - Made bigger but not as much as Vyom text */}
      <div className="flex gap-8 z-10 mb-12">
        <Link 
          href="/auth/login" 
          className="px-16 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:scale-110 transition-all duration-300 shadow-xl shadow-blue-600/40 border-2 border-cyan-400/40 hover:shadow-cyan-500/50"
        >
          Login
        </Link>
        <Link 
          href="/auth/register" 
          className="px-16 py-5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold text-lg hover:scale-110 transition-all duration-300 shadow-xl shadow-blue-600/40 border-2 border-blue-400/40 hover:shadow-blue-500/50"
        >
          Register
        </Link>
      </div>

      {/* Website Caption - Subtle at the bottom */}
      <div className="absolute bottom-6 z-10">
        <p className="text-blue-300/40 text-xs font-light text-center max-w-md px-4">
          VYOM - Advanced satellite imagery analysis platform leveraging AI for intelligent 
          earth observation insights and data-driven decision making
        </p>
      </div>

      {/* Custom CSS for minimal glow */}
      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(100, 200, 255, 0.3);
          }
          50% { 
            text-shadow: 0 0 15px rgba(100, 200, 255, 0.5);
          }
        }
        
        .text-9xl {
          animation: subtle-glow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}