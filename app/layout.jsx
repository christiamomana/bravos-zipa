import './globals.css';
import { Lobster, Anton } from 'next/font/google';
import Header from '@/components/Header';

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-lobster-next',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton-next',
});

export const metadata = {
  title: 'Bravos de Zipaquirá ⚾',
  description: 'Gestión del equipo Bravos de Zipaquirá',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${lobster.variable} ${anton.variable}`}>
      <body className="bg-negro min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
