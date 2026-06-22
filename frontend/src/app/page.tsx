import Link from 'next/link';
import { WashingMachine, Coins, Wrench, CalendarClock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: WashingMachine,
    title: 'Makine Yönetimi',
    description: 'Yıkama ve kurutma makinelerinizi bölge bazında takip edin, durumlarını anlık görün.',
  },
  {
    icon: Coins,
    title: 'Tahsilat Takibi',
    description: 'Bozuk para ve kart gelirlerini makine bazında kaydedin, günlük ciro özetini alın.',
  },
  {
    icon: Wrench,
    title: 'Onarım Emirleri',
    description: 'Arızalı makineler için öncelikli onarım emirleri oluşturun ve süreci izleyin.',
  },
  {
    icon: CalendarClock,
    title: 'Bakım Planı',
    description: 'Havalandırma, tambur ve motor bakımlarını planlayın, gecikmeleri önleyin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-foreground bg-secondary text-secondary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))]">
              <WashingMachine className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold uppercase tracking-tight">WashLedger</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="brutal-btn rounded-none text-secondary-foreground hover:bg-accent">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="brutal-btn rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b-2 border-foreground bg-accent/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Çamaşırhane Operasyon Yönetimi
              </p>
              <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
                Makinelerinizi, tahsilatınızı ve bakımınızı tek panelden yönetin
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                WashLedger ile makine envanterinizi, günlük gelirinizi, onarım emirlerinizi ve bakım
                programınızı brutalist netlikte kontrol altında tutun.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild className="brutal-btn rounded-none bg-primary hover:bg-primary/90">
                  <Link href="/register">
                    14 Gün Ücretsiz Dene
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="brutal-btn rounded-none">
                  <Link href="/login">Panele Giriş</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-bold uppercase">Özellikler</h2>
          <div className="brutal-divider mt-4 mb-10" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="brutal-card p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t-2 border-foreground bg-card">
          <div className="mx-auto max-w-6xl px-6 py-12 text-center">
            <h2 className="font-display text-2xl font-bold uppercase">Çamaşırhanenizi dijitalleştirin</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              WashLedger ile makinelerinizi, tahsilatlarınızı ve bakım programınızı kolayca yönetin.
            </p>
            <Button className="brutal-btn mt-6 rounded-none bg-primary hover:bg-primary/90" size="lg" asChild>
              <Link href="/register">Hemen Başlayın</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-foreground py-6 text-center font-mono text-xs uppercase text-muted-foreground">
        © {new Date().getFullYear()} WashLedger — Çamaşırhane Operasyon Platformu
      </footer>
    </div>
  );
}
