import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '../types/store';
import { Search, ShoppingBag, Star, X, Clock } from 'lucide-react';
import { Modal } from './ui/Modal';
import { formatIQD } from '../lib/format';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const SUGGESTIONS = ['iPhone 17 Pro', 'Samsung S26', 'AirPods Pro', 'شاحن GaN', 'MagSafe', 'Apple Watch'];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  products,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.specs?.some((s) => s.toLowerCase().includes(q))
    );
  }, [query, products]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="البحث في المتجر" subtitle={`${products.length} منتج متوفر`} icon={Search}>
      <div className="p-5 sm:p-6">
        {/* حقل البحث */}
        <div className="relative">
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن iPhone, Samsung, AirPods, شاحن, كيبل..."
            className="mnr-field h-12 pr-11 pl-10"
            aria-label="ابحث عن منتج"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-3 pointer-events-none" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="مسح البحث"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* اقتراحات */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto mnr-no-scrollbar pb-1">
          <span className="flex items-center gap-1 text-[11px] text-ink-3 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            الأكثر بحثاً
          </span>
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="mnr-badge mnr-badge-neutral hover:mnr-badge-brand shrink-0 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* النتائج */}
        <div className="mt-4 pt-4 border-t border-line">
          <div className="flex items-center justify-between text-[11px] text-ink-3 mb-2.5">
            <span>النتائج ({results.length})</span>
            <span>الأسعار بالدينار العراقي</span>
          </div>

          {results.length === 0 ? (
            <p className="py-10 text-center text-xs text-ink-3">
              لا توجد منتجات مطابقة لـ «{query}». جرّب كلمة أخرى.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[52vh] overflow-y-auto">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-line bg-surface-2 hover:border-brand/40 hover:bg-brand-soft transition-colors text-right"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-surface shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-brand-ink">{product.brand}</span>
                      <h4 className="text-xs font-extrabold text-ink truncate">{product.name}</h4>
                      <span className="flex items-center gap-1 text-[10px] text-ink-3 mt-0.5">
                        <Star className="w-3 h-3 fill-gold text-gold" />
                        {product.rating}
                        <span>•</span>
                        {product.stock > 0 ? `متوفر (${product.stock})` : 'نفد'}
                      </span>
                    </div>

                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-extrabold text-gold mnr-num">{formatIQD(product.price)}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            onAddToCart(product);
                          }
                        }}
                        aria-label="أضف للسلة"
                        className="w-9 h-9 grid place-items-center rounded-lg bg-brand text-on-brand hover:brightness-110 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};
