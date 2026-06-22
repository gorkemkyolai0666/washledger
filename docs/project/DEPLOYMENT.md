# WashLedger Deployment

**Son Güncelleme**: 2026-06-22

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@sparklecoinlaundry.com |
| Şifre | demo123456 |

## Canlı URL'ler

| Servis | URL | Durum |
|--------|-----|-------|
| Frontend | https://washledger.vercel.app | ✅ Canlı |
| Backend | https://washledger-backend-production.up.railway.app/api | ⏳ Sync sonrası yeniden deploy |
| Health | https://washledger-backend-production.up.railway.app/api/health | ⏳ Sync sonrası yeniden deploy |

## Bulut Canlı Önizleme Linki

Google Project IDX otomatik import:

https://idx.google.com/import?url=https://github.com/gorkemkyolai0666/washledger

## Ortam Değişkenleri

### Backend (Railway)

```
DATABASE_URL=<postgresql-connection-string>
JWT_SECRET=<random-secret>
FRONTEND_URL=https://washledger.vercel.app
PORT=8080
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://washledger-backend-production.up.railway.app/api
```

## Yerel Geliştirme

```bash
cd backend
cp .env.example .env
npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
npm run start:dev

cd ../frontend
cp .env.example .env.local
npm install && npm run dev
```

| Servis | Port |
|--------|------|
| Frontend | 3009 |
| Backend | 4009 |

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

- `main` branch push → test + provision tetiklenir
- Entegrasyon testleri: 14 senaryo (`tests/integration.sh`)

## Deployment Metadata

- `backend/.railway/config.json` — provision job sonrası oluşturulur
- Vercel proje bağlantısı — provision job sonrası oluşturulur
