import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** نافذة تأكيد للأفعال التي لا يمكن التراجع عنها (حذف، استعادة) */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  body,
  confirmLabel = 'تأكيد',
  onCancel,
  onConfirm,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} size="sm" disableOutsideClose>
    <div className="p-6 text-center">
      <span className="w-14 h-14 rounded-2xl bg-danger-soft text-danger grid place-items-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </span>

      <h3 className="mnr-h2 text-base text-ink">{title}</h3>
      <p className="text-xs text-ink-2 mt-2 leading-relaxed">{body}</p>

      <div className="grid grid-cols-2 gap-2.5 mt-5">
        <button type="button" onClick={onCancel} className="mnr-btn mnr-btn-soft h-11">
          إلغاء
        </button>
        <button type="button" onClick={onConfirm} className="mnr-btn mnr-btn-danger h-11">
          {confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);
