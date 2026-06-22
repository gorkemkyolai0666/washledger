import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

const MACHINE_STATUS: Record<string, string> = {
  operational: 'Çalışıyor',
  down: 'Arızalı',
  maintenance: 'Bakımda',
  retired: 'Emekli',
};

export function formatMachineStatus(status: string): string {
  return MACHINE_STATUS[status] || status;
}

const MACHINE_TYPE: Record<string, string> = {
  washer: 'Yıkama',
  dryer: 'Kurutma',
  combo: 'Kombi',
  fold_station: 'Katla',
};

export function formatMachineType(type: string): string {
  return MACHINE_TYPE[type] || type;
}

const PAYMENT_TYPE: Record<string, string> = {
  coin: 'Bozuk Para',
  card: 'Kart',
  both: 'Her İkisi',
};

export function formatPaymentType(type: string): string {
  return PAYMENT_TYPE[type] || type;
}

const COLLECTION_STATUS: Record<string, string> = {
  recorded: 'Kayıtlı',
  verified: 'Doğrulandı',
  disputed: 'İtirazlı',
};

export function formatCollectionStatus(status: string): string {
  return COLLECTION_STATUS[status] || status;
}

const REPAIR_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatRepairStatus(status: string): string {
  return REPAIR_STATUS[status] || status;
}

const REPAIR_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatRepairPriority(priority: string): string {
  return REPAIR_PRIORITY[priority] || priority;
}

const SERVICE_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatServiceStatus(status: string): string {
  return SERVICE_STATUS[status] || status;
}

const SERVICE_CATEGORY: Record<string, string> = {
  vent_cleaning: 'Havalandırma',
  belt_replacement: 'Kayış',
  drum_service: 'Tambur',
  motor_repair: 'Motor',
  plumbing: 'Tesisat',
  electrical: 'Elektrik',
  other: 'Diğer',
};

export function formatServiceCategory(category: string): string {
  return SERVICE_CATEGORY[category] || category;
}

const PRICING_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatPricingStatus(status: string): string {
  return PRICING_STATUS[status] || status;
}

const PRICING_CATEGORY: Record<string, string> = {
  wash_small: 'Küçük Yıkama',
  wash_large: 'Büyük Yıkama',
  wash_extra_large: 'XL Yıkama',
  dry_low: 'Düşük Kurutma',
  dry_high: 'Yüksek Kurutma',
  combo: 'Kombi',
  other: 'Diğer',
};

export function formatPricingCategory(category: string): string {
  return PRICING_CATEGORY[category] || category;
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Ocak', 2: 'Şubat', 3: 'Mart', 4: 'Nisan', 5: 'Mayıs', 6: 'Haziran',
  7: 'Temmuz', 8: 'Ağustos', 9: 'Eylül', 10: 'Ekim', 11: 'Kasım', 12: 'Aralık',
};

export function formatMonth(month: number): string {
  return MONTH_NAMES[month] || String(month);
}
