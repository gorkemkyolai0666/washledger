# WashLedger Mimari

## Genel Yapı

```
projects/washledger/
├── frontend/     # Next.js 14 (port 3009)
├── backend/      # NestJS (port 4009)
├── docs/
└── tests/
```

## Backend Modülleri

- AuthModule — JWT kimlik doğrulama
- LaundromatModule — İşletme profili
- MachinesModule — Makine CRUD
- CollectionsModule — Tahsilat kayıtları
- RepairOrdersModule — Onarım iş emirleri
- ServiceSchedulesModule — Bakım planlama
- PricingTiersModule — Fiyat katmanları
- DashboardModule — İstatistikler

## Veritabanı

PostgreSQL + Prisma ORM. Multi-tenant: her kayıt `laundromatId` ile izole.

## Deployment

- Railway: backend + PostgreSQL
- Vercel: frontend
- GitHub Actions: CI/CD
