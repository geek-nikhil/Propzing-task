'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthProvider'; // Adjust the import path

export default function Navbar() {
  const { session, signOut } = useAuth(); // Access session and signOut from useAuth

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Task Management
        </Link>
        <div className="flex space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-gray-200">
                Dashboard
              </Link>
              <button
                onClick={signOut} // Call signOut on button click
                className="text-white hover:text-gray-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/components/login" className="text-white hover:text-gray-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}