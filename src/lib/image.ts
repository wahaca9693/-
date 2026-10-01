/**
 * معالجة الصور قبل حفظها في المتصفح.
 *
 * المشروع يعمل بالكامل على العميل (بدون خادم)، لذلك تُحفظ الصور كـ data-URI
 * داخل localStorage. ولأن السعة محدودة (~5MB) نضغط الصورة قبل الحفظ:
 * تصغير الأبعاد + ضغط JPEG متدرّج حتى الوصول لحجم مقبول دون فقدان الوضوح.
 */

export interface CompressOptions {
  /** أقصى عرض/ارتفاع بالبكسل */
  maxSize?: number;
  /** جودة JPEG الأولية (0.6 - 0.9) */
  quality?: number;
  /** الحجم الأقصى للملف الناتج بالكيلوبايت */
  maxKb?: number;
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxSize: 1000,
  quality: 0.85,
  maxKb: 280,
};

/** قراءة الملف كـ ImageBitmap/HTMLImageElement */
const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('تعذّر قراءة الصورة'));
    };
    img.src = url;
  });

/**
 * يضغط الصورة ويعيدها كـ data-URI جاهزة للتخزين.
 * يبدأ بجودة عالية ويخفّضها تدريجياً حتى يختفي الحد الأقصى للكيلوبايت.
 */
export const compressImage = async (
  file: File,
  options: CompressOptions = {}
): Promise<{ dataUrl: string; width: number; height: number; kb: number }> => {
  const { maxSize, quality, maxKb } = { ...DEFAULT_OPTIONS, ...options };

  if (!file.type.startsWith('image/')) {
    throw new Error('الملف المختار ليس صورة');
  }

  const img = await loadImage(file);

  // حساب الأبعاد الجديدة مع الحفاظ على النسبة
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('تعذّر تجهيز الصورة');

  // خلفية بيضاء حتى لا تصبح صور PNG الشفافة سوداء بعد التحويل
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // محاولة متدرجة لبلوغ الحجم المطلوب
  let currentQuality = quality;
  let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

  while (dataUrl.length * 0.75 / 1024 > maxKb && currentQuality > 0.4) {
    currentQuality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
  }

  // إذا بقيت كبيرة جداً، نصغّر الأبعاد مرة أخرى
  let finalWidth = width;
  let finalHeight = height;
  while (dataUrl.length * 0.75 / 1024 > maxKb && finalWidth > 400) {
    finalWidth = Math.round(finalWidth * 0.8);
    finalHeight = Math.round(finalHeight * 0.8);
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, finalWidth, finalHeight);
    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
    dataUrl = canvas.toDataURL('image/jpeg', 0.6);
  }

  return {
    dataUrl,
    width: finalWidth,
    height: finalHeight,
    kb: Math.round((dataUrl.length * 0.75) / 1024),
  };
};

/** تنزيل ملف نصي (JSON/CSV) من المتصفح */
export const downloadFile = (content: string, filename: string, mime = 'application/json') => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/** قراءة ملف نصي مرفوع من المستخدم */
export const readTextFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('تعذّر قراءة الملف'));
    reader.readAsText(file);
  });

/** ختم اليوم بصيغة YYYY-MM-DD */
export const todayStamp = (): string => new Date().toISOString().slice(0, 10);
