import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  count?: number;
  icon?: React.ElementType;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * درج جانبي (السلة / المفضلة).
 * يفتح من اليمين ليتماشى مع اتجاه الواجهة العربية RTL.
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  count,
  icon: Icon,
  children,
  footer,
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
    <div className="fixed inset-0 z-[60] animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <aside
        className="absolute inset-y-0 right-0 w-full max-w-md bg-surface border-l border-line shadow-float flex flex-col animate-drawer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand-ink grid place-items-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="mnr-h2 text-base truncate">{title}</h2>
              {typeof count === 'number' && (
                <p className="text-xs text-ink-3">{count} عنصر</p>
              )}
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>

        {footer && <div className="border-t border-line bg-surface-2 p-4 sm:p-5 shrink-0">{footer}</div>}
      </aside>
    </div>
  );
};
