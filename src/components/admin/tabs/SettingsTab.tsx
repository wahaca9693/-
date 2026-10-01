import React, { useRef, useState } from 'react';
import {
  Save,
  Store,
  Phone,
  MessageSquare,
  MapPin,
  KeyRound,
  Volume2,
  VolumeX,
  Database,
  Download,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import { StoreSettings } from '../../../types/store';
import { storeStorage } from '../../../services/storeStorage';
import { downloadFile, readTextFile, todayStamp } from '../../../lib/image';
import { useAdmin } from '../AdminContext';
import { Panel, Field } from '../ui';
import { ConfirmDialog } from '../ConfirmDialog';

export const SettingsTab: React.FC = () => {
  const { settings, saveStoreSettings, notify, refreshAll } = useAdmin();
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [confirm, setConfirm] = useState<'import' | 'danger' | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = () => {
    saveStoreSettings(draft);
    notify('تم حفظ إعدادات المتجر');
  };

  const handleExportSnapshot = () => {
    const snapshot = storeStorage.exportSnapshot();
    downloadFile(JSON.stringify(snapshot, null, 2), `mnr-backup-${todayStamp()}.json`);
    notify('تم تنزيل النسخة الاحتياطية الكاملة');
  };

  const handleImportSnapshot = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await readTextFile(file));
      storeStorage.importSnapshot(parsed, { withOrders: false });
      refreshAll();
      notify('تمت استعادة النسخة الاحتياطية');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'الملف غير صالح', 'danger');
    }
  };

  return (
    <div className="space-y-4">
      {/* بيانات المتجر */}
      <Panel
        title="بيانات المتجر"
        description="تظهر في الفوتر وصفحة «من نحن» وتقارير الطلبات"
        action={
          <button type="button" onClick={handleSave} className="mnr-btn mnr-btn-primary h-9 text-xs">
            <Save className="w-4 h-4" />
            حفظ
          </button>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="اسم المتجر">
            <input
              value={draft.storeName}
              onChange={(e) => set('storeName', e.target.value)}
              className="mnr-field"
            />
          </Field>

          <Field label="الوصف المختصر">
            <input
              value={draft.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
              className="mnr-field"
            />
          </Field>

          <Field label="رقم الهاتف">
            <input
              value={draft.phone}
              onChange={(e) => set('phone', e.target.value)}
              dir="ltr"
              className="mnr-field mnr-num"
            />
          </Field>

          <Field label="رقم الواتساب" hint="بصيغة دولية بدون +">
            <input
              value={draft.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              dir="ltr"
              className="mnr-field mnr-num"
            />
          </Field>

          <Field label="العنوان" className="sm:col-span-2">
            <input
              value={draft.address}
              onChange={(e) => set('address', e.target.value)}
              className="mnr-field"
            />
          </Field>
        </div>

        {/* معاينة روابط التواصل */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
          <a
            href={`https://wa.me/${draft.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="mnr-btn mnr-btn-soft h-9 text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            معاينة رابط الواتساب
          </a>
          <a href={`tel:${draft.phone}`} className="mnr-btn mnr-btn-soft h-9 text-xs">
            <Phone className="w-3.5 h-3.5" />
            معاينة رابط الاتصال
          </a>
        </div>
      </Panel>

      {/* الأمان */}
      <Panel title="الأمان والتنبيهات" description="رمز دخول لوحة الإدارة وصوت التنبيهات">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="رمز الدخول للوحة الإدارة" hint="4 أرقام — الافتراضي 1234">
            <input
              value={draft.adminPin}
              onChange={(e) => set('adminPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              dir="ltr"
              className="mnr-field mnr-num tracking-[0.5em] text-center"
            />
          </Field>

          <div>
            <p className="mnr-label">تنبيه صوتي عند وصول طلب جديد</p>
            <button
              type="button"
              onClick={() => {
                const next = !draft.audioNotifications;
                set('audioNotifications', next);
                saveStoreSettings({ ...draft, audioNotifications: next });
              }}
              className={`w-full h-11 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-colors ${
                draft.audioNotifications
                  ? 'bg-success-soft border-success/30 text-success'
                  : 'bg-surface-2 border-line text-ink-3'
              }`}
            >
              {draft.audioNotifications ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {draft.audioNotifications ? 'مُفعّل' : 'مكتوم'}
            </button>
          </div>
        </div>
      </Panel>

      {/* النسخ الاحتياطي */}
      <Panel
        title="النسخ الاحتياطي للبيانات"
        description="كل البيانات محفوظة في متصفح جهازك — صدّر نسخة احتياطية بانتظام"
      >
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleExportSnapshot} className="mnr-btn mnr-btn-primary h-10 text-xs">
            <Download className="w-4 h-4" />
            تنزيل نسخة كاملة (JSON)
          </button>

          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="mnr-btn mnr-btn-soft h-10 text-xs"
          >
            <Upload className="w-4 h-4" />
            استعادة نسخة احتياطية
          </button>

          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              handleImportSnapshot(e.target.files?.[0]);
              if (importRef.current) importRef.current.value = '';
            }}
          />
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-warn-soft border border-warn/25 mt-4">
          <ShieldCheck className="w-4 h-4 text-warn shrink-0 mt-0.5" />
          <p className="text-[11px] text-ink-2 leading-relaxed">
            تنبيه: البيانات محفوظة في هذا المتصفح فقط. مسح بيانات المتصفح أو استخدام جهاز آخر
            يعني عدم ظهورها. نزّل نسخة احتياطية أسبوعياً على الأقل.
          </p>
        </div>
      </Panel>

      {/* منطقة الخطر */}
      <Panel title="منطقة الخطر" description="إجراءات لا يمكن التراجع عنها">
        <button
          type="button"
          onClick={() => setConfirm('danger')}
          className="mnr-btn mnr-btn-danger h-10 text-xs"
        >
          <Database className="w-4 h-4" />
          مسح كل البيانات والعودة للحالة الأولى
        </button>
      </Panel>

      <ConfirmDialog
        isOpen={Boolean(confirm)}
        title={confirm === 'danger' ? 'مسح كل البيانات؟' : 'تأكيد الاستعادة'}
        body={
          confirm === 'danger'
            ? 'سيتم حذف كل المنتجات والطلبات والزبائن والعروض التي أضفتها والعودة للبيانات الأصلية. لا يمكن التراجع.'
            : 'سيتم استبدال البيانات الحالية بمحتوى الملف.'
        }
        confirmLabel={confirm === 'danger' ? 'نعم، امسح كل شيء' : 'استعادة'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm === 'danger') {
            localStorage.clear();
            location.reload();
          }
          setConfirm(null);
        }}
      />
    </div>
  );
};
