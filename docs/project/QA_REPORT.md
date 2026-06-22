# WashLedger QA Raporu

**Tarih**: 2026-06-22  
**Durum**: production_ready (yerel doğrulama tamamlandı)

## Test Sonuçları

| Kategori | Sonuç |
|----------|-------|
| Backend unit testleri | 1/1 geçti |
| Entegrasyon testleri | 14/14 geçti |
| Frontend build | Başarılı |

## Pre-Delivery Checklist

- [x] ci.yml `npm install --legacy-peer-deps` (backend)
- [x] ci.yml `npm install` (frontend, root)
- [x] ci.yml NO cache in setup-node
- [x] backendPort 4009 / frontendPort 3009 tutarlı
- [x] Postgres credentials washledger
- [x] @HttpCode(200) POST /auth/login
- [x] backend/Procfile: `web: npm run deploy`
- [x] nixpacks.toml legacy-peer-deps + prisma generate
- [x] backend package.json engines node >=20
- [x] backend/.npmrc legacy-peer-deps=true
- [x] provision scripts template versiyonu

## Deploy Durumu

⏳ Fabrika PR merge sonrası provision-new-project + downstream CI provision bekleniyor.
