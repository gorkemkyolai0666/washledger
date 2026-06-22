'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, WashingMachine } from 'lucide-react';
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
  formatMachineStatus,
  formatMachineType,
  formatPaymentType,
} from '@/lib/utils';

interface Machine {
  id: string;
  number: string;
  zone: string;
  machineType: string;
  capacityLbs: number;
  paymentType: string;
  brand?: string;
  status: string;
}

interface ListResponse {
  data: Machine[];
  total: number;
}

const MACHINE_TYPES = ['washer', 'dryer', 'combo', 'fold_station'];
const PAYMENT_TYPES = ['coin', 'card', 'both'];
const STATUSES = ['operational', 'down', 'maintenance', 'retired'];

const emptyForm = {
  number: '',
  zone: '',
  machineType: 'washer',
  capacityLbs: '20',
  paymentType: 'both',
  brand: '',
  status: 'operational',
};

export default function MachinesPage() {
  const { token } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.machines
      .list(token)
      .then((res) => setMachines((res as ListResponse).data))
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
      await api.machines.create(token, {
        number: form.number,
        zone: form.zone,
        machineType: form.machineType,
        capacityLbs: parseInt(form.capacityLbs, 10),
        paymentType: form.paymentType,
        brand: form.brand || undefined,
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

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bu makineyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.machines.delete(token, id);
      load();
    } catch {
      setError(true);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Makineler</h1>
            <p className="text-muted-foreground">Yıkama ve kurutma makineleri envanteri</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="brutal-btn rounded-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Makine'}
          </Button>
        </div>
        <div className="brutal-divider" />

        {showForm && (
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="font-display uppercase">Makine Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="number">Numara</Label>
                  <Input id="number" value={form.number} onChange={(e) => update('number', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Bölge</Label>
                  <Input id="zone" value={form.zone} onChange={(e) => update('zone', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineType">Tip</Label>
                  <select
                    id="machineType"
                    value={form.machineType}
                    onChange={(e) => update('machineType', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {MACHINE_TYPES.map((t) => (
                      <option key={t} value={t}>{formatMachineType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacityLbs">Kapasite (lbs)</Label>
                  <Input id="capacityLbs" type="number" min={1} value={form.capacityLbs} onChange={(e) => update('capacityLbs', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Ödeme</Label>
                  <select
                    id="paymentType"
                    value={form.paymentType}
                    onChange={(e) => update('paymentType', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {PAYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{formatPaymentType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marka</Label>
                  <Input id="brand" value={form.brand} onChange={(e) => update('brand', e.target.value)} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatMachineStatus(s)}</option>
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
        {error && !loading && machines.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && machines.length === 0 && (
          <EmptyState
            title="Makine bulunamadı"
            description="Henüz makine eklenmemiş. İlk makinenizi ekleyerek başlayın."
            action={
              <Button onClick={() => setShowForm(true)} className="brutal-btn rounded-none">
                <Plus className="mr-2 h-4 w-4" />
                Makine Ekle
              </Button>
            }
          />
        )}
        {!loading && machines.length > 0 && (
          <Card className="brutal-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3">No</th>
                      <th className="p-3">Bölge</th>
                      <th className="p-3">Tip</th>
                      <th className="p-3">Kapasite</th>
                      <th className="p-3">Ödeme</th>
                      <th className="p-3">Marka</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.map((machine) => (
                      <tr key={machine.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-bold">
                          <span className="flex items-center gap-2">
                            <WashingMachine className="h-4 w-4 text-primary" />
                            {machine.number}
                          </span>
                        </td>
                        <td className="p-3">{machine.zone}</td>
                        <td className="p-3">{formatMachineType(machine.machineType)}</td>
                        <td className="p-3 font-mono">{machine.capacityLbs} lbs</td>
                        <td className="p-3">{formatPaymentType(machine.paymentType)}</td>
                        <td className="p-3 text-muted-foreground">{machine.brand || '—'}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatMachineStatus(machine.status)}</Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(machine.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            aria-label="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
