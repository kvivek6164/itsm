import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import '@/styles/tailwind.css';

export const metadata: Metadata = {
  title: 'ITServiceDesk — IT Service Management',
  description: 'Enterprise IT service management platform for tickets, requests, and SLA tracking',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
</head>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}