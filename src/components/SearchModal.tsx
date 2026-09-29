import React, { useState, useMemo } from 'react';
import { Product } from '../types/store';
import { X, Search, ShoppingBag, Star, Zap } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  products,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query, products]);

  const formatIQD = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + ' د.ع';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#d4af37]/35 shadow-2xl p-5 sm:p-6 text-right text-[#f5f5f7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center mb-4">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن iPhone, Samsung, AirPods, شاحن, كيبل..."
            className="w-full h-13 px-4 pr-12 pl-12 rounded-2xl bg-[#121212] border border-[#d4af37]/40 text-base text-[#ffd700] placeholder:text-[#99907c] focus:outline-none focus:border-[#ffd700] shadow-inner"
          />
          <Search className="absolute right-4 w-5 h-5 text-[#ffd700] pointer-events-none" />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute left-4 p-1 rounded-lg bg-[#222] text-[#99907c] hover:text-[#f5f5f7]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute left-4 p-1 rounded-lg bg-[#222] text-[#99907c] hover:text-[#f5f5f7]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar mb-4">
          <span className="text-[#99907c] shrink-0">الأكثر بحثاً:</span>
          {['iPhone 17 Pro', 'Samsung S26', 'AirPods Pro', 'شاحن GaN', 'MagSafe', 'Apple Watch'].map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="px-3 py-1 rounded-full bg-[#181818] border border-[#d4af37]/20 text-[#d0c5af] hover:text-[#ffd700] hover:border-[#ffd700]/40 shrink-0 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          <div className="flex justify-between items-center text-xs text-[#99907c] px-1">
            <span>نتائج البحث ({filtered.length})</span>
            <span>الأسعار بالدينار العراقي (IQD)</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#99907c]">
              لا توجد منتجات مطابقة لكلمة البحث "{query}". جرب كلمة أخرى.
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#121212] hover:bg-[#1c180e] border border-[#d4af37]/15 hover:border-[#d4af37]/45 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-[#0a0a0a] border border-[#d4af37]/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#d4af37] font-bold block uppercase">
                      {product.brand}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#f5f5f7] group-hover:text-[#ffd700] truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#99907c] mt-0.5">
                      <Star className="w-3 h-3 fill-[#ffd700] text-[#ffd700]" />
                      <span>{product.rating}</span>
                      <span>•</span>
                      <span>{product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 mr-3">
                  <span className="text-sm font-black text-[#ffd700]">
                    {formatIQD(product.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    disabled={product.stock <= 0}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-[#0a0a0a] flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40"
                    title="أضف إلى السلة"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
