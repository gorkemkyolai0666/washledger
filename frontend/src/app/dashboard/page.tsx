'use client';

import { useEffect, useState } from 'react';
import { WashingMachine, Coins, Wrench, CalendarClock, TrendingUp, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatCollectionStatus,
  formatRepairStatus,
  formatRepairPriority,
} from '@/lib/utils';

interface DashboardStats {
  totalMachines: number;
  operationalMachines: number;
  downMachines: number;
  machineUtilizationRate: number;
  openRepairOrders: number;
  urgentRepairOrders: number;
  pendingServiceSchedules: number;
  dailyRevenue: number;
  recentCollections: Array<{
    id: string;
    coinAmount: number;
    cardAmount: number;
    collectedAt: string;
    status: string;
    machine?: { number: string; zone: string; machineType: string };
  }>;
  recentRepairOrders: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    machine?: { number: string; zone: string };
  }>;
  zones: Array<{ zone: string; machineCount: number }>;
  monthlyTrend: Array<{ month: string; collections: number; revenue: number }>;
}

function formatTrendMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Operasyon Paneli</h1>
          <p className="text-muted-foreground">Makine kullanımı ve günlük gelir özeti</p>
          <div className="brutal-divider mt-4" />
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                className="brutal-card"
                title="Makine Kullanımı"
                value={formatPercent(stats.machineUtilizationRate)}
                description={`${stats.operationalMachines}/${stats.totalMachines} makine çalışıyor`}
                icon={<WashingMachine className="h-4 w-4" strokeWidth={2.5} />}
              />
              <StatCard
                className="brutal-card"
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.downMachines} makine arızalı`}
                icon={<Coins className="h-4 w-4" strokeWidth={2.5} />}
              />
              <StatCard
                className="brutal-card"
                title="Açık Onarımlar"
                value={stats.openRepairOrders}
                description={`${stats.urgentRepairOrders} acil/yüksek öncelik`}
                icon={<Wrench className="h-4 w-4" strokeWidth={2.5} />}
              />
              <StatCard
                className="brutal-card"
                title="Bekleyen Bakım"
                value={stats.pendingServiceSchedules}
                description="7 gün içinde planlanan"
                icon={<CalendarClock className="h-4 w-4" strokeWidth={2.5} />}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="brutal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-xl uppercase">
                    <Coins className="h-4 w-4 text-primary" />
                    Son Tahsilatlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentCollections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz tahsilat kaydı yok.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-foreground text-left font-mono text-xs uppercase">
                            <th className="pb-2 pr-4">Makine</th>
                            <th className="pb-2 pr-4">Tutar</th>
                            <th className="pb-2 pr-4">Tarih</th>
                            <th className="pb-2">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentCollections.map((collection) => (
                            <tr key={collection.id} className="border-b border-muted">
                              <td className="py-2 pr-4 font-medium">
                                #{collection.machine?.number}
                                <span className="ml-1 text-muted-foreground">({collection.machine?.zone})</span>
                              </td>
                              <td className="py-2 pr-4 font-mono">
                                {formatCurrency(collection.coinAmount + collection.cardAmount)}
                              </td>
                              <td className="py-2 pr-4">{formatDateTime(collection.collectedAt)}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{formatCollectionStatus(collection.status)}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="brutal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-xl uppercase">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Açık Onarım Emirleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentRepairOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Açık onarım emri yok.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-foreground text-left font-mono text-xs uppercase">
                            <th className="pb-2 pr-4">Başlık</th>
                            <th className="pb-2 pr-4">Makine</th>
                            <th className="pb-2 pr-4">Öncelik</th>
                            <th className="pb-2">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentRepairOrders.map((order) => (
                            <tr key={order.id} className="border-b border-muted">
                              <td className="py-2 pr-4 font-medium">{order.title}</td>
                              <td className="py-2 pr-4 text-muted-foreground">
                                #{order.machine?.number} ({order.machine?.zone})
                              </td>
                              <td className="py-2 pr-4">
                                <Badge variant="secondary">{formatRepairPriority(order.priority)}</Badge>
                              </td>
                              <td className="py-2">
                                <Badge variant="secondary">{formatRepairStatus(order.status)}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="brutal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-xl uppercase">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Aylık Tahsilat Trendi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-foreground text-left font-mono text-xs uppercase">
                          <th className="pb-2 pr-4">Ay</th>
                          <th className="pb-2 pr-4">Tahsilat</th>
                          <th className="pb-2">Gelir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.monthlyTrend.map((row) => (
                          <tr key={row.month} className="border-b border-muted">
                            <td className="py-2 pr-4 font-medium">{formatTrendMonth(row.month)}</td>
                            <td className="py-2 pr-4">{row.collections}</td>
                            <td className="py-2 font-mono">{formatCurrency(row.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="brutal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-xl uppercase">
                    <WashingMachine className="h-4 w-4 text-primary" />
                    Bölge Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.zones.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz makine tanımlanmamış.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-foreground text-left font-mono text-xs uppercase">
                            <th className="pb-2 pr-4">Bölge</th>
                            <th className="pb-2">Makine Sayısı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.zones.map((z) => (
                            <tr key={z.zone} className="border-b border-muted">
                              <td className="py-2 pr-4 font-medium">{z.zone}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{z.machineCount} makine</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
