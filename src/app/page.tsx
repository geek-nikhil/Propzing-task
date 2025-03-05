'use client'
import Dashboard from "./components/dashboard/page";
import { useAuth } from '@/lib/AuthProvider';
export default function Home() {
  const { session } = useAuth();
   return (
    (session && session.user) ? (
      <>
        <Dashboard/>
      </>
    ) : (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <p className="text-gray-700 text-lg font-semibold">You are not logged in.</p>
      </div>
    </div>
    )
  );
}
