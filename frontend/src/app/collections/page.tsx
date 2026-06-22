'use client';

import { useEffect, useState } from 'react';
import { Plus, Coins } from 'lucide-react';
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
  formatDateTime,
  formatCollectionStatus,
  formatMachineType,
} from '@/lib/utils';

interface MachineOption {
  id: string;
  number: string;
  zone: string;
}

interface Collection {
  id: string;
  coinAmount: number;
  cardAmount: number;
  cycleCount: number;
  collectedAt: string;
  status: string;
  machine?: { id: string; number: string; zone: string; machineType: string };
}

interface ListResponse {
  data: Collection[];
  total: number;
}

const COLLECTION_STATUSES = ['recorded', 'verified', 'disputed'];

const emptyForm = {
  machineId: '',
  coinAmount: '0',
  cardAmount: '0',
  cycleCount: '0',
  collectedAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function CollectionsPage() {
  const { token } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [machines, setMachines] = useState<MachineOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.collections.list(token), api.machines.list(token)])
      .then(([collectionsRes, machinesRes]) => {
        setCollections((collectionsRes as ListResponse).data);
        setMachines(
          ((machinesRes as { data: MachineOption[] }).data || []).map((m) => ({
            id: m.id,
            number: m.number,
            zone: m.zone,
          })),
        );
      })
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
      await api.collections.create(token, {
        machineId: form.machineId,
        coinAmount: parseFloat(form.coinAmount),
        cardAmount: parseFloat(form.cardAmount),
        cycleCount: parseInt(form.cycleCount, 10),
        collectedAt: new Date(form.collectedAt).toISOString(),
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
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Tahsilat</h1>
            <p className="text-muted-foreground">Makine bazında bozuk para ve kart gelirleri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="brutal-btn rounded-none">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Tahsilat'}
          </Button>
        </div>
        <div className="brutal-divider" />

        {showForm && (
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="font-display uppercase">Tahsilat Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="machineId">Makine</Label>
                  <select
                    id="machineId"
                    value={form.machineId}
                    onChange={(e) => update('machineId', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    <option value="">Makine seçin</option>
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        #{m.number} — {m.zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coinAmount">Bozuk Para ($)</Label>
                  <Input id="coinAmount" type="number" min={0} step="0.01" value={form.coinAmount} onChange={(e) => update('coinAmount', e.target.value)} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardAmount">Kart ($)</Label>
                  <Input id="cardAmount" type="number" min={0} step="0.01" value={form.cardAmount} onChange={(e) => update('cardAmount', e.target.value)} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycleCount">Döngü Sayısı</Label>
                  <Input id="cycleCount" type="number" min={0} value={form.cycleCount} onChange={(e) => update('cycleCount', e.target.value)} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectedAt">Tahsilat Tarihi</Label>
                  <Input id="collectedAt" type="datetime-local" value={form.collectedAt} onChange={(e) => update('collectedAt', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {COLLECTION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatCollectionStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end sm:col-span-2 lg:col-span-3">
                  <Button type="submit" disabled={submitting} className="brutal-btn rounded-none">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && collections.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && collections.length === 0 && (
          <EmptyState
            title="Tahsilat bulunamadı"
            description="Henüz tahsilat kaydı yok. İlk tahsilatınızı ekleyerek başlayın."
            action={
              <Button onClick={() => setShowForm(true)} className="brutal-btn rounded-none">
                <Plus className="mr-2 h-4 w-4" />
                Tahsilat Ekle
              </Button>
            }
          />
        )}
        {!loading && collections.length > 0 && (
          <Card className="brutal-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3">Makine</th>
                      <th className="p-3">Bozuk Para</th>
                      <th className="p-3">Kart</th>
                      <th className="p-3">Toplam</th>
                      <th className="p-3">Döngü</th>
                      <th className="p-3">Tarih</th>
                      <th className="p-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((collection) => (
                      <tr key={collection.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-primary" />
                            #{collection.machine?.number}
                            <span className="text-muted-foreground">
                              ({collection.machine?.zone} · {formatMachineType(collection.machine?.machineType || '')})
                            </span>
                          </span>
                        </td>
                        <td className="p-3 font-mono">{formatCurrency(collection.coinAmount)}</td>
                        <td className="p-3 font-mono">{formatCurrency(collection.cardAmount)}</td>
                        <td className="p-3 font-mono font-bold">
                          {formatCurrency(collection.coinAmount + collection.cardAmount)}
                        </td>
                        <td className="p-3">{collection.cycleCount}</td>
                        <td className="p-3">{formatDateTime(collection.collectedAt)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatCollectionStatus(collection.status)}</Badge>
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
