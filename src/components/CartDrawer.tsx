import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CheckoutModal from './CheckoutModal';

const fmt = (n: number) => new Intl.NumberFormat('es-PY').format(n);

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[151] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-primary" />
                  <h2 className="text-lg font-black text-slate-900">Tu Carrito</h2>
                  {totalItems > 0 && (
                    <span className="bg-primary text-black text-xs font-black px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center pb-16">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Package size={36} className="text-slate-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-slate-500 font-bold">Tu carrito está vacío</p>
                    <p className="text-slate-400 text-sm mt-1">Agregá productos para empezar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="bg-slate-50 rounded-2xl p-4 flex gap-3"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 flex-shrink-0 bg-white rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={24} className="text-slate-300" strokeWidth={1.5} />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-primary font-black text-sm mt-1">
                            Gs. {fmt(item.product.price)}
                          </p>

                          {/* Quantity + delete */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors"
                              >
                                <Minus size={14} className="text-slate-600" />
                              </button>
                              <span className="w-8 text-center text-sm font-black text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors"
                              >
                                <Plus size={14} className="text-slate-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-slate-100 px-5 py-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold text-sm">Total</span>
                    <span className="text-2xl font-black text-slate-900">
                      Gs. {fmt(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={() => { closeCart(); setShowCheckout(true); }}
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-extrabold py-4 rounded-2xl text-base transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                  >
                    Hacer Pedido por WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal onClose={() => setShowCheckout(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
