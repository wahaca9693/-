/**
 * أدوات التنسيق الموحّدة للمتجر.
 * مكان واحد للأرقام والعملة حتى لا تتكرر في كل مكوّن.
 */

const IQD = new Intl.NumberFormat('en-US');

/** تنسيق مبلغ بالدينار العراقي: 1,480,000 د.ع */
export const formatIQD = (value: number): string => `${IQD.format(Math.round(value))} د.ع`;

/** رقم بدون عملة (للعدادات والجداول) */
export const formatNumber = (value: number): string => IQD.format(value);

/** اختصار المبالغ الكبيرة للوحة الإدارة: 12.4 مليون */
export const formatCompactIQD = (value: number): string => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)} مليون د.ع`;
  }
  if (value >= 1_000) {
    return `${IQD.format(value)} د.ع`;
  }
  return `${IQD.format(value)} د.ع`;
};

/** نسبة مئوية آمنة (تتجنّب NaN) */
export const formatPercent = (value: number): string =>
  Number.isFinite(value) ? `${Math.round(value)}%` : '—';
