
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          QR Attendance System
        </h1>
        <p className="text-gray-600 mt-2">
          Simplify your attendance management with QR codes.
        </p>
      </header>

      <main className="w-full max-w-md text-center">
        <p className="text-lg text-gray-700 mb-6">
          Seamless and efficient way to mark attendance in seconds.
        </p>
        <Link href="/auth/signup">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
            Get Started
          </button>
        </Link>
      </main>

      <footer className="absolute bottom-4 text-gray-500">
        <p>&copy; 2024 QR Attendance System. All rights reserved.</p>
      </footer>
    </div>
  );
}
