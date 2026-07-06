'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Trophy, Users, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: Trophy },
  { href: '/session', label: 'Sesión de Jugadores', icon: Users },
  { href: '/lineup', label: 'Lineup', icon: ClipboardList },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-negro2/95 backdrop-blur border-b-2 border-dorado">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="leading-none">
            <span className="font-lobster text-3xl text-dorado-claro">Bravos</span>
            <span className="block font-anton text-xs tracking-[3px] uppercase text-gris-claro">
              de Zipaquirá
            </span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="p-2 rounded-lg text-dorado hover:bg-card border border-borde transition-colors"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-negro2 border-r-2 border-dorado p-6 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-lobster text-3xl text-dorado-claro">Bravos</span>
            <span className="block font-anton text-xs tracking-[3px] uppercase text-gris">
              de Zipaquirá
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="p-2 rounded-lg text-gris hover:text-dorado transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-dorado text-negro font-semibold'
                    : 'text-gris-claro hover:bg-card hover:text-dorado-claro'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
