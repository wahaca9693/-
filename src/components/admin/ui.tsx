import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { OrderStatus } from '../../types/store';

/* ------------------------------------------------------------------ */
/* بطاقات الإحصائيات                                                    */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: 'brand' | 'gold' | 'success' | 'danger' | 'warn' | 'info';
  trend?: { value: number; suffix?: string };
}

const TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
  brand: 'bg-brand-soft text-brand-ink',
  gold: 'bg-gold-soft text-gold',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  warn: 'bg-warn-soft text-warn',
  info: 'bg-info-soft text-info',
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'brand',
  trend,
}) => (
  <div className="p-4 rounded-2xl border border-line bg-surface flex items-start gap-3.5">
    <span className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${TONE[tone]}`}>
      <Icon className="w-5 h-5" />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] text-ink-3 truncate">{label}</p>
      <p className="mnr-num text-xl font-extrabold text-ink leading-tight mt-0.5">{value}</p>
      {hint && <p className="text-[10px] text-ink-3 mt-0.5 truncate">{hint}</p>}
      {trend && trend.value !== 0 && (
        <p
          className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${
            trend.value > 0 ? 'text-success' : 'text-danger'
          }`}
        >
          {trend.value > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.value > 0 ? '+' : ''}
          {trend.value}
          {trend.suffix ?? '%'}
        </p>
      )}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* حاويات عامة                                                         */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}> = ({ title, description, action, children, className = '', bodyClassName = 'p-4 sm:p-5' }) => (
  <section className={`rounded-2xl border border-line bg-surface ${className}`}>
    {(title || action) && (
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-line">
        <div className="min-w-0">
          {title && <h3 className="mnr-h2 text-sm text-ink">{title}</h3>}
          {description && <p className="text-[11px] text-ink-3 mt-0.5">{description}</p>}
        </div>
        {action}
      </header>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
);

export const EmptyState: React.FC<{
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, description, action }) => (
  <div className="py-14 text-center space-y-3">
    <span className="w-14 h-14 rounded-2xl bg-surface-2 border border-line grid place-items-center text-ink-3 mx-auto">
      <Icon className="w-6 h-6" />
    </span>
    <p className="text-sm font-extrabold text-ink">{title}</p>
    {description && <p className="text-xs text-ink-3 max-w-sm mx-auto">{description}</p>}
    {action && <div className="pt-1">{action}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/* حالة الطلب                                                          */
/* ------------------------------------------------------------------ */

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; badge: string; dot: string }> = {
  new: { label: 'جديد', badge: 'mnr-badge-brand', dot: 'bg-brand' },
  reviewing: { label: 'قيد المراجعة', badge: 'mnr-badge-info', dot: 'bg-info' },
  confirmed: { label: 'مؤكّد', badge: 'mnr-badge-success', dot: 'bg-success' },
  processing: { label: 'قيد التجهيز', badge: 'mnr-badge-warn', dot: 'bg-warn' },
  shipped: { label: 'خرج للتوصيل', badge: 'mnr-badge-info', dot: 'bg-info' },
  delivered: { label: 'تم التسليم', badge: 'mnr-badge-success', dot: 'bg-success' },
  cancelled: { label: 'ملغي', badge: 'mnr-badge-danger', dot: 'bg-danger' },
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'new',
  'reviewing',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const meta = ORDER_STATUS_META[status];
  return <span className={`mnr-badge ${meta.badge}`}>{meta.label}</span>;
};

/* ------------------------------------------------------------------ */
/* حقول النماذج                                                       */
/* ------------------------------------------------------------------ */

export const Field: React.FC<{
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, error, required, children, className = '' }) => (
  <div className={className}>
    <label className="mnr-label">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[10px] text-ink-3 mt-1">{hint}</p>}
    {error && <p className="text-[10px] text-danger mt-1 font-bold">{error}</p>}
  </div>
);

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) => (
  <div className="inline-flex rounded-xl border border-line bg-surface-2 p-0.5 gap-0.5 flex-wrap">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`h-8 px-3 rounded-lg text-[11px] font-bold transition-colors ${
          value === option.value ? 'bg-brand text-on-brand' : 'text-ink-2 hover:text-ink'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);
