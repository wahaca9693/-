import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { compressImage } from '../../lib/image';

interface ImageUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  /** نص بديل عند عدم وجود صورة */
  productName?: string;
  /** أقصى حجم للملف بالكيلوبايت بعد الضغط */
  maxKb?: number;
}

/**
 * رفع صورة المنتج مع ضغطها قبل الحفظ.
 * تُحفظ الصورة كـ data-URI داخل localStorage لأن المشروع يعمل بالكامل على العميل،
 * لذلك نضغطها أولاً (تصغير + ضغط JPEG) حتى لا تمتلئ مساحة التخزين.
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  productName = 'منتج',
  maxKb = 280,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const result = await compressImage(file, { maxKb });
      onChange(result.dataUrl);
      setInfo(`${result.width}×${result.height} بكسل — ${result.kb} كيلوبايت بعد الضغط`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر معالجة الصورة');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        {/* المعاينة */}
        <div className="w-28 h-28 rounded-xl overflow-hidden border border-line bg-surface-2 grid place-items-center shrink-0 relative">
          {value ? (
            <img src={value} alt={productName} className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="w-7 h-7 text-ink-3" />
          )}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-surface/80">
              <Loader2 className="w-5 h-5 text-brand-ink animate-spin" />
            </div>
          )}
        </div>

        {/* التحكم */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="mnr-btn mnr-btn-soft h-9 text-xs"
            >
              <ImagePlus className="w-4 h-4" />
              اختيار صورة
            </button>

            {value && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setInfo(null);
                  }}
                  className="mnr-btn mnr-btn-danger h-9 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  إزالة
                </button>
                <a
                  href={value}
                  download={`${productName}.jpg`}
                  className="mnr-btn mnr-btn-ghost h-9 text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  تنزيل الصورة
                </a>
              </>
            )}
          </div>

          <p className="text-[10px] text-ink-3 leading-relaxed">
            JPG أو PNG أو WebP. تُضغط الصورة تلقائياً إلى {maxKb} كيلوبايت بحد أقصى
            حتى لا تمتلئ مساحة تخزين المتصفح.
          </p>

          {info && <p className="text-[10px] text-success font-bold">{info}</p>}
          {error && <p className="text-[10px] text-danger font-bold">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};
