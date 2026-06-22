# WashLedger API

**Base URL**: `/api`  
**Auth**: Bearer JWT

## Auth

| Method | Endpoint | Status | Auth |
|--------|----------|--------|------|
| POST | /auth/register | 201 | No |
| POST | /auth/login | 200 | No |
| GET | /auth/me | 200 | Yes |

## Health

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | /health | 200 |

## Resources

| Method | Endpoint | Status | Auth |
|--------|----------|--------|------|
| GET | /laundromat | 200 | Yes |
| PATCH | /laundromat | 200 | Yes |
| GET | /dashboard/stats | 200 | Yes |
| GET/POST | /machines | 200/201 | Yes |
| GET/PATCH/DELETE | /machines/:id | 200 | Yes |
| GET/POST | /collections | 200/201 | Yes |
| GET/PATCH/DELETE | /collections/:id | 200 | Yes |
| GET/POST | /repair-orders | 200/201 | Yes |
| GET | /repair-orders/urgent | 200 | Yes |
| GET/PATCH/DELETE | /repair-orders/:id | 200 | Yes |
| GET/POST | /service-schedules | 200/201 | Yes |
| GET/PATCH/DELETE | /service-schedules/:id | 200 | Yes |
| GET/POST | /pricing-tiers | 200/201 | Yes |
| GET/PATCH/DELETE | /pricing-tiers/:id | 200 | Yes |
