'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface LaundromatProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalMachines: number;
  timezone: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [laundromat, setLaundromat] = useState<LaundromatProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.laundromat
      .get(token)
      .then((data) => setLaundromat(data as LaundromatProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !laundromat) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.laundromat.update(token, laundromat as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Ayarlar</h1>
          <p className="text-muted-foreground">Çamaşırhane profil bilgileri</p>
          <div className="brutal-divider mt-4" />
        </div>

        {loading && <LoadingSpinner />}
        {error && !laundromat && <ErrorState onRetry={load} />}
        {laundromat && !loading && (
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="font-display uppercase">Çamaşırhane Profili</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="border-2 border-success bg-success/10 p-3 text-sm text-success">
                    Ayarlar kaydedildi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Çamaşırhane Adı</Label>
                  <Input
                    value={laundromat.name}
                    onChange={(e) => setLaundromat({ ...laundromat, name: e.target.value })}
                    required
                    className="rounded-none border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input
                    value={laundromat.phone || ''}
                    onChange={(e) => setLaundromat({ ...laundromat, phone: e.target.value })}
                    className="rounded-none border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adres</Label>
                  <Input
                    value={laundromat.address || ''}
                    onChange={(e) => setLaundromat({ ...laundromat, address: e.target.value })}
                    className="rounded-none border-2"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Şehir</Label>
                    <Input
                      value={laundromat.city || ''}
                      onChange={(e) => setLaundromat({ ...laundromat, city: e.target.value })}
                      className="rounded-none border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İl</Label>
                    <Input
                      value={laundromat.state || ''}
                      onChange={(e) => setLaundromat({ ...laundromat, state: e.target.value })}
                      className="rounded-none border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Posta Kodu</Label>
                    <Input
                      value={laundromat.zipCode || ''}
                      onChange={(e) => setLaundromat({ ...laundromat, zipCode: e.target.value })}
                      className="rounded-none border-2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Toplam Makine Kapasitesi</Label>
                  <Input
                    type="number"
                    value={laundromat.totalMachines}
                    onChange={(e) =>
                      setLaundromat({ ...laundromat, totalMachines: parseInt(e.target.value, 10) || 0 })
                    }
                    className="rounded-none border-2"
                  />
                </div>
                <Button type="submit" disabled={saving} className="brutal-btn rounded-none">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
