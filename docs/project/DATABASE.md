# WashLedger Veritabanı

## Modeller

| Model | Açıklama |
|-------|----------|
| Laundromat | Çamaşırhane işletmesi |
| User | Kullanıcı (owner/manager/attendant) |
| Machine | Yıkama/kurutma makinesi |
| Collection | Günlük tahsilat kaydı |
| RepairOrder | Onarım iş emri |
| ServiceSchedule | Önleyici bakım planı |
| PricingTier | Fiyat katmanı |

## Migration

```bash
npm run db:migrate  # prisma migrate deploy
npm run db:seed     # prisma db seed
```

## Demo Verisi

- 6 makine (washer, dryer, combo)
- 2 tahsilat kaydı
- 2 onarım emri
- 2 bakım planı
- 4 fiyat katmanı
