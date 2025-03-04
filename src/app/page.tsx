'use client'
import Image from "next/image";
import Dashboard from "./components/dashboard/page";
import { useAuth } from '@/lib/AuthProvider';
export default function Home() {
   return (
    <>
   <Dashboard/>
    </>
  );
}
