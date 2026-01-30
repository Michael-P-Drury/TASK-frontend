'use client';

import Link from 'next/link';
import { useState } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', margin: 0, minHeight: '100vh' }}>
        <aside style={{
          width: '250px',
          backgroundColor: '#f4f4f4',
          borderRight: '1px solid #ddd',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/account">Account</Link>
            <Link href="/">Chat</Link>
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}