# WashLedger Tasarım Sistemi

## Tasarım Yönü: Brutalist Technical

Endüstriyel çamaşırhane operasyonlarına uygun, keskin ve yüksek kontrastlı brutalist estetik. Elektrik camgöbeği (#00BCD4) birincil renk, güvenlik sarısı (#FFEB3B) vurgu, siyah-beyaz kontrast. Sol dar ikon rayı navigasyonu. 0px border radius.

BrewTrack (Art Deco, üst sekme), UnitFlow (neo-banking), CampLedger (sidebar orman yeşili) projelerinden tamamen farklı.

## Renk Paleti

| Token | Hex | Kullanım |
|-------|-----|----------|
| primary | #00BCD4 | CTA, aktif nav, vurgular |
| accent | #FFEB3B | Uyarılar, acil onarım |
| foreground | #141414 | Metin, border |
| background | #FAFAFA | Sayfa arka planı |
| success | #2E7D5A | Çalışan makineler |
| destructive | #E53935 | Arızalı makineler |

## Tipografi

| Rol | Font | Kullanım |
|-----|------|----------|
| Display/Body | Space Grotesk | Başlıklar, gövde metni |
| Mono | JetBrains Mono | Makine numaraları, tutarlar |

## Spacing

4px taban: 4, 8, 12, 16, 24, 32, 48, 64

## Border Radius

0px — tüm bileşenler keskin köşeli

## Navigasyon

Sol sabit ikon rayı (64-80px genişlik). Sidebar panel yok, üst tab yok.

## Bileşen Dili

- `.brutal-card` — 2px border + offset shadow
- `.brutal-btn` — uppercase, bold, offset shadow
- `.machine-cell` — durum bazlı makine hücreleri
