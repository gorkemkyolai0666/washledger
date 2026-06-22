'use client';

import { useEffect, useState } from 'react';
import { Plus, Wrench } from 'lucide-react';
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
  formatDateTime,
  formatRepairStatus,
  formatRepairPriority,
} from '@/lib/utils';

interface MachineOption {
  id: string;
  number: string;
  zone: string;
}

interface RepairOrder {
  id: string;
  title: string;
  priority: string;
  status: string;
  reportedAt: string;
  machine?: { id: string; number: string; zone: string };
}

interface ListResponse {
  data: RepairOrder[];
  total: number;
}

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

const emptyForm = {
  machineId: '',
  title: '',
  priority: 'medium',
  status: 'open',
  reportedAt: new Date().toISOString().slice(0, 16),
};

export default function RepairOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<RepairOrder[]>([]);
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
    Promise.all([api.repairOrders.list(token), api.machines.list(token)])
      .then(([ordersRes, machinesRes]) => {
        setOrders((ordersRes as ListResponse).data);
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
      await api.repairOrders.create(token, {
        machineId: form.machineId,
        title: form.title,
        priority: form.priority,
        status: form.status,
        reportedAt: new Date(form.reportedAt).toISOString(),
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
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Onarım Emirleri</h1>
            <p className="text-muted-foreground">Makine arızaları ve onarım takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="brutal-btn rounded-none">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Emir'}
          </Button>
        </div>
        <div className="brutal-divider" />

        {showForm && (
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="font-display uppercase">Onarım Emri Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2 sm:col-span-2">
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
                  <Label htmlFor="priority">Öncelik</Label>
                  <select
                    id="priority"
                    value={form.priority}
                    onChange={(e) => update('priority', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{formatRepairPriority(p)}</option>
                    ))}
                  </select>
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
                      <option key={s} value={s}>{formatRepairStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="reportedAt">Bildirim Tarihi</Label>
                  <Input id="reportedAt" type="datetime-local" value={form.reportedAt} onChange={(e) => update('reportedAt', e.target.value)} required className="rounded-none border-2" />
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
        {error && !loading && orders.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && orders.length === 0 && (
          <EmptyState
            title="Onarım emri bulunamadı"
            description="Henüz onarım emri yok. İlk emrinizi oluşturarak başlayın."
            action={
              <Button onClick={() => setShowForm(true)} className="brutal-btn rounded-none">
                <Plus className="mr-2 h-4 w-4" />
                Emir Ekle
              </Button>
            }
          />
        )}
        {!loading && orders.length > 0 && (
          <Card className="brutal-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3">Başlık</th>
                      <th className="p-3">Makine</th>
                      <th className="p-3">Öncelik</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3">Bildirim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-primary" />
                            {order.title}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          #{order.machine?.number} ({order.machine?.zone})
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatRepairPriority(order.priority)}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatRepairStatus(order.status)}</Badge>
                        </td>
                        <td className="p-3">{formatDateTime(order.reportedAt)}</td>
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
