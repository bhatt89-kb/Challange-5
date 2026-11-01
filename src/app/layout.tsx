import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GenAI Event Planner',
  description: 'Plan your perfect event with AI assistance - weddings, birthdays, and community events',
  keywords: ['event planning', 'AI', 'wedding planner', 'birthday planner', 'event management'],
  authors: [{ name: 'GenAI Event Planner' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
