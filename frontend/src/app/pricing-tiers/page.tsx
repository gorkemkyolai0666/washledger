'use client';

import { useEffect, useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatPricingStatus,
  formatPricingCategory,
} from '@/lib/utils';

interface PricingTier {
  id: string;
  title: string;
  tierCategory: string;
  basePrice: number;
  status: string;
}

interface ListResponse {
  data: PricingTier[];
  total: number;
}

const CATEGORIES = [
  'wash_small',
  'wash_large',
  'wash_extra_large',
  'dry_low',
  'dry_high',
  'combo',
  'other',
];
const STATUSES = ['active', 'upcoming', 'archived'];

const emptyForm = {
  title: '',
  tierCategory: 'wash_small',
  basePrice: '3.00',
  status: 'active',
};

export default function PricingTiersPage() {
  const { token } = useAuth();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.pricingTiers
      .list(token)
      .then((res) => setTiers((res as ListResponse).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await api.pricingTiers.create(token, {
        title: form.title,
        tierCategory: form.tierCategory,
        basePrice: parseFloat(form.basePrice),
        status: form.status,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Fiyatlandırma</h1>
            <p className="text-muted-foreground">Yıkama ve kurutma fiyat kademeleri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="brutal-btn rounded-none">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kademe'}
          </Button>
        </div>
        <div className="brutal-divider" />

        {showForm && (
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="font-display uppercase">Fiyat Kademesi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required placeholder="Örn: Küçük Yıkama" className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tierCategory">Kategori</Label>
                  <select
                    id="tierCategory"
                    value={form.tierCategory}
                    onChange={(e) => update('tierCategory', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatPricingCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Temel Fiyat ($)</Label>
                  <Input id="basePrice" type="number" min={0} step="0.01" value={form.basePrice} onChange={(e) => update('basePrice', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm sm:max-w-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatPricingStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="brutal-btn rounded-none">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && tiers.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && tiers.length === 0 && (
          <EmptyState
            title="Fiyat kademesi bulunamadı"
            description="Henüz fiyat kademesi yok. İlk kademenizi ekleyerek başlayın."
            action={
              <Button onClick={() => setShowForm(true)} className="brutal-btn rounded-none">
                <Plus className="mr-2 h-4 w-4" />
                Kademe Ekle
              </Button>
            }
          />
        )}
        {!loading && tiers.length > 0 && (
          <Card className="brutal-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3">Başlık</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Temel Fiyat</th>
                      <th className="p-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier) => (
                      <tr key={tier.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Tags className="h-4 w-4 text-primary" />
                            {tier.title}
                          </span>
                        </td>
                        <td className="p-3">{formatPricingCategory(tier.tierCategory)}</td>
                        <td className="p-3 font-mono font-bold">{formatCurrency(tier.basePrice)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatPricingStatus(tier.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
