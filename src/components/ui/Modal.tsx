import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  /** يمنع الإغلاق بالنقر خارج الصندوق (للخطوات التأكيدية) */
  disableOutsideClose?: boolean;
}

const SIZE_MAP: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

/**
 * نافذة مركزية موحّدة: خلفية معتمة، قفل تمرير، إغلاق بـ ESC، وحركة دخول هادئة.
 * كل النوافذ في المتجر تستخدم هذا المكوّن لضمان تناسق الشكل والسلوك.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  size = 'md',
  children,
  disableOutsideClose = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (!disableOutsideClose && event.target === event.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      <div
        className={`relative w-full ${SIZE_MAP[size]} sm:rounded-2xl rounded-t-3xl bg-surface border border-line shadow-float animate-pop my-0 sm:my-8 max-h-[92vh] overflow-hidden flex flex-col text-ink`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {(title || Icon) && (
          <header className="flex items-start justify-between gap-4 px-5 sm:px-7 pt-5 pb-4 border-b border-line shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand-ink grid place-items-center shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
              )}
              <div className="min-w-0">
                {title && <h2 className="mnr-h2 text-lg sm:text-xl truncate">{title}</h2>}
                {subtitle && <p className="text-xs text-ink-3 mt-0.5">{subtitle}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="w-9 h-9 grid place-items-center rounded-lg text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
        )}

        <div className="overflow-y-auto grow">{children}</div>
      </div>
    </div>
  );
};
