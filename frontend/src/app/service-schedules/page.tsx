'use client';

import { useEffect, useState } from 'react';
import { Plus, CalendarClock } from 'lucide-react';
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
  formatServiceStatus,
  formatServiceCategory,
} from '@/lib/utils';

interface ServiceSchedule {
  id: string;
  title: string;
  category: string;
  zone?: string;
  scheduledAt: string;
  status: string;
}

interface ListResponse {
  data: ServiceSchedule[];
  total: number;
}

const CATEGORIES = [
  'vent_cleaning',
  'belt_replacement',
  'drum_service',
  'motor_repair',
  'plumbing',
  'electrical',
  'other',
];
const STATUSES = ['scheduled', 'in_progress', 'completed', 'overdue'];

const emptyForm = {
  title: '',
  category: 'other',
  zone: '',
  scheduledAt: new Date().toISOString().slice(0, 16),
  status: 'scheduled',
};

export default function ServiceSchedulesPage() {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.serviceSchedules
      .list(token)
      .then((res) => setSchedules((res as ListResponse).data))
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
      await api.serviceSchedules.create(token, {
        title: form.title,
        category: form.category,
        zone: form.zone || undefined,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
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
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Bakım Planı</h1>
            <p className="text-muted-foreground">Periyodik bakım ve servis programı</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="brutal-btn rounded-none">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Plan'}
          </Button>
        </div>
        <div className="brutal-divider" />

        {showForm && (
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="font-display uppercase">Bakım Planı Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="flex h-10 w-full rounded-none border-2 border-input bg-background px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatServiceCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Bölge</Label>
                  <Input id="zone" value={form.zone} onChange={(e) => update('zone', e.target.value)} placeholder="Örn: Ön Salon" className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Planlanan Tarih</Label>
                  <Input id="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} required className="rounded-none border-2" />
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
                      <option key={s} value={s}>{formatServiceStatus(s)}</option>
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
        {error && !loading && schedules.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && schedules.length === 0 && (
          <EmptyState
            title="Bakım planı bulunamadı"
            description="Henüz bakım planı yok. İlk planınızı oluşturarak başlayın."
            action={
              <Button onClick={() => setShowForm(true)} className="brutal-btn rounded-none">
                <Plus className="mr-2 h-4 w-4" />
                Plan Ekle
              </Button>
            }
          />
        )}
        {!loading && schedules.length > 0 && (
          <Card className="brutal-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3">Başlık</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Bölge</th>
                      <th className="p-3">Planlanan</th>
                      <th className="p-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            {schedule.title}
                          </span>
                        </td>
                        <td className="p-3">{formatServiceCategory(schedule.category)}</td>
                        <td className="p-3 text-muted-foreground">{schedule.zone || '—'}</td>
                        <td className="p-3">{formatDateTime(schedule.scheduledAt)}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatServiceStatus(schedule.status)}</Badge>
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
