'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import Navbar from '@/app/components/navbar/page';
import LoginPage from '@/app/components/login/page'

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      router.push('/login'); // Redirect to login if the user is not logged in
    }
  }, [session, router]);

  // Render children only if the user is logged in
  return session ? <>{children}</> : <LoginPage/>;
}