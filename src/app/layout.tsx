import { AuthProvider } from '@/lib/AuthProvider';
import './globals.css';
import { ReactNode } from 'react';
import Navbar from './components/navbar/page';
import AuthRedirect from '@/lib/AuthRedirect';
export const metadata = {
  title: 'Task Management',
  description: 'Task Management App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}