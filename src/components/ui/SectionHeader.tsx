import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: React.ElementType;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** عنوان موحّد لكل أقسام الصفحة — يمنح إيقاعاً بصرياً ثابتاً */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${className}`}>
    <div className="min-w-0">
      {eyebrow && (
        <span className="mnr-badge mnr-badge-brand mb-2.5">
          {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5" />}
          {eyebrow}
        </span>
      )}
      <h2 className="mnr-h2 text-xl sm:text-2xl lg:text-3xl text-ink">{title}</h2>
      {description && <p className="text-sm text-ink-2 mt-1.5 max-w-2xl">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
