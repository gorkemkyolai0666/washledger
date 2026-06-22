'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  WashingMachine,
  LayoutDashboard,
  Coins,
  Wrench,
  CalendarClock,
  Tags,
  Sun,
  Moon,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/machines', label: 'Makineler', icon: WashingMachine },
  { href: '/collections', label: 'Tahsilat', icon: Coins },
  { href: '/repair-orders', label: 'Onarım', icon: Wrench },
  { href: '/service-schedules', label: 'Bakım', icon: CalendarClock },
  { href: '/pricing-tiers', label: 'Fiyat', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function IconRailNav() {
  const pathname = usePathname();
  const { laundromat, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r-2 border-foreground bg-background lg:w-20">
      <Link
        href="/dashboard"
        className="flex h-16 items-center justify-center border-b-2 border-foreground bg-primary text-primary-foreground"
        aria-label="WashLedger ana sayfa"
      >
        <WashingMachine className="h-7 w-7" strokeWidth={2.5} />
      </Link>

      <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Ana menü">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-none border-2 p-2 text-[10px] font-bold uppercase tracking-wider transition-colors',
                active
                  ? 'border-foreground bg-accent text-accent-foreground'
                  : 'border-transparent text-muted-foreground hover:border-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.5} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t-2 border-foreground p-2">
        {laundromat && (
          <p className="mb-1 hidden truncate px-1 text-center text-[9px] font-bold uppercase text-muted-foreground lg:block">
            {laundromat.name}
          </p>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-full rounded-none border-2 border-transparent hover:border-foreground"
          aria-label="Tema değiştir"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-10 w-full rounded-none border-2 border-transparent hover:border-destructive hover:text-destructive"
          aria-label="Çıkış yap"
        >
          <LogOut className="h-4 w-4" />
        </Button>
        {user && (
          <p className="hidden truncate px-1 text-center text-[9px] text-muted-foreground lg:block">
            {user.firstName}
          </p>
        )}
      </div>
    </aside>
  );
}
