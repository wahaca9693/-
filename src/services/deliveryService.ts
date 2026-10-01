import { DeliverySettings } from '../types/store';
import { IRAQ_GOVERNORATES } from '../data/initialData';

const STORAGE_KEY = 'mnr_delivery_settings';

/** مدة التوصيل التقديرية الافتراضية لكل محافظة (بالأيام) */
const DEFAULT_ETA: Record<string, number> = {
  'بغداد': 1,
  'كربلاء المقدسة': 1,
  'النجف الأشرف': 1,
  'القادسية': 1,
  'بابل': 1,
  'واسط': 2,
  'ديالى': 2,
  'صلاح الدين': 2,
  'نينوى': 2,
  'الأنبار': 2,
  'كركوك': 3,
  'السليمانية': 3,
  'دهوك': 3,
  'حلبجة': 3,
  ' ذي قار': 3,
  'ميسان': 3,
  'البصرة': 4,
  'المثنى': 4,
};

const DEFAULT_ZONES = (): DeliverySettings['zones'] =>
  IRAQ_GOVERNORATES.map((gov) => ({
    governorate: gov,
    fee: 5000,
    freeAbove: 1_500_000,
    etaDays: DEFAULT_ETA[gov.trim()] ?? 3,
    enabled: true,
  }));

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  defaultFee: 5000,
  defaultEtaDays: 3,
  freeShippingThreshold: 0,
  allowCashOnDelivery: true,
  zones: DEFAULT_ZONES(),
};

class DeliveryService {
  private listeners = new Set<(data: DeliverySettings) => void>();

  private read(): DeliverySettings {
    if (typeof localStorage === 'undefined') return DEFAULT_DELIVERY_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DELIVERY_SETTINGS;
      const parsed = JSON.parse(raw) as DeliverySettings;
      // دمج مع الافتراضي حتى لا تنكسر الحقول عند إضافة إعدادات جديدة
      return {
        ...DEFAULT_DELIVERY_SETTINGS,
        ...parsed,
        zones: Array.isArray(parsed.zones) ? parsed.zones : DEFAULT_ZONES(),
      };
    } catch {
      return DEFAULT_DELIVERY_SETTINGS;
    }
  }

  getSettings(): DeliverySettings {
    return this.read();
  }

  saveSettings(settings: DeliverySettings): DeliverySettings {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    this.listeners.forEach((cb) => cb(settings));
    return settings;
  }

  reset(): DeliverySettings {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = DEFAULT_DELIVERY_SETTINGS;
    this.listeners.forEach((cb) => cb(fresh));
    return fresh;
  }

  subscribe(cb: (data: DeliverySettings) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  /** تكلفة توصيل سلة لعنوان معيّن */
  quote(governorate: string, subtotal: number) {
    const config = this.getSettings();
    const zone = config.zones.find((z) => z.governorate === governorate);

    if (zone && !zone.enabled) {
      return { available: false, fee: 0, etaDays: 0, free: false, zone };
    }

    const threshold = config.freeShippingThreshold || zone?.freeAbove || 0;
    const free = threshold > 0 && subtotal >= threshold;
    const fee = free ? 0 : zone ? zone.fee : config.defaultFee;
    const etaDays = zone?.etaDays ?? config.defaultEtaDays;

    return { available: true, fee, etaDays, free, zone };
  }
}

export const deliveryService = new DeliveryService();
