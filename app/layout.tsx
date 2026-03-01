'use client';
import { useEffect } from 'react';
import "./globals.css";
import SmartTracker from './lib/smart-tracker';
SmartTracker.init('/api/report');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message,
          stack: event.error?.stack || 'No stack trace available',
          metadata: { 
            url: window.location.href, 
            browser: navigator.userAgent 
          }
        })
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
