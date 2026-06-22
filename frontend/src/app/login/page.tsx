'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WashingMachine } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 pb-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <WashingMachine className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">WashLedger</h1>
        <p className="mt-1 text-muted-foreground">Çamaşırhane operasyon yönetimi</p>
      </div>

      <Card className="brutal-card w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl uppercase">Hoş Geldiniz</CardTitle>
          <CardDescription>Çamaşırhane operasyonlarınızı yönetmek için giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border-2 border-destructive bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@sparklecoinlaundry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded-none border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="rounded-none border-2"
              />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Demo: demo@sparklecoinlaundry.com
            </p>
            <Button type="submit" className="brutal-btn w-full rounded-none" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Kayıt olun
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
