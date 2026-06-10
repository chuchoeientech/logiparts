import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const WHATSAPP_NUMBER = '595971191016';

const fmt = (n: number) => new Intl.NumberFormat('es-PY').format(n);

interface Props {
  onClose: () => void;
}

interface FormData {
  nombre: string;
  telefono: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
  correo: string;
}

const empty: FormData = {
  nombre: '',
  telefono: '',
  ruc: '',
  razonSocial: '',
  direccion: '',
  correo: '',
};

export default function CheckoutModal({ onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormData>(empty);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSend = () => {
    const lines: string[] = [
      '🛒 *PEDIDO LOGISPARTS*',
      '',
      '📦 *PRODUCTOS:*',
    ];

    items.forEach((item, i) => {
      const subtotal = item.product.price * item.quantity;
      lines.push(
        `${i + 1}. ${item.product.name}` +
          (item.product.codigoBarra ? ` — Cód: ${item.product.codigoBarra}` : '') +
          `\n   Cantidad: ${item.quantity} uds.` +
          `\n   Precio unitario: Gs. ${fmt(item.product.price)}` +
          `\n   Subtotal: Gs. ${fmt(subtotal)}`
      );
    });

    lines.push('', `💰 *TOTAL: Gs. ${fmt(totalPrice)}*`, '──────────────────────');

    lines.push(
      '',
      '📄 *DATOS DE FACTURACIÓN:*',
      `Nombre: ${form.nombre}`,
      `Teléfono: ${form.telefono}`,
      `RUC: ${form.ruc.trim() || '—'}`,
      `Razón Social: ${form.razonSocial.trim() || '—'}`,
      `Dirección: ${form.direccion.trim() || '—'}`,
      `Correo: ${form.correo.trim() || '—'}`,
      '──────────────────────'
    );

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
    clearCart();
    onClose();
  };

  const canSend = form.nombre.trim() && form.telefono.trim();

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="text-lg font-black text-slate-900">Finalizar Pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Order summary */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Resumen del pedido</p>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start text-sm">
                  <span className="text-slate-700 font-semibold flex-1 pr-4 leading-snug">
                    {item.product.name}
                    <span className="text-slate-400 font-normal"> ×{item.quantity}</span>
                  </span>
                  <span className="text-slate-900 font-bold whitespace-nowrap">
                    Gs. {fmt(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
              <span className="text-sm font-black text-slate-600 uppercase tracking-wide">Total</span>
              <span className="text-xl font-black text-primary">Gs. {fmt(totalPrice)}</span>
            </div>
          </div>

          {/* Datos de facturación */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">Datos de facturación</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Todos los pedidos se emiten con factura. Nombre y teléfono son obligatorios; los demás datos podés completarlos después.
          </p>

          <div className="space-y-4">
            <Field label="Nombre completo *" value={form.nombre} onChange={set('nombre')} placeholder="Ej: Juan Pérez" />
            <Field label="Teléfono *" value={form.telefono} onChange={set('telefono')} placeholder="Ej: 0981 123 456" type="tel" />
            <Field label="RUC" value={form.ruc} onChange={set('ruc')} placeholder="Ej: 1234567-8" />
            <Field label="Razón Social" value={form.razonSocial} onChange={set('razonSocial')} placeholder="Ej: Empresa S.A." />
            <Field label="Dirección" value={form.direccion} onChange={set('direccion')} placeholder="Ej: Av. España 1234" />
            <Field label="Correo electrónico" value={form.correo} onChange={set('correo')} placeholder="correo@empresa.com" type="email" />
          </div>

          <motion.button
            onClick={handleSend}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.01 } : {}}
            whileTap={canSend ? { scale: 0.98 } : {}}
            className="mt-6 w-full bg-[#25D366] hover:bg-[#20BA5A] disabled:bg-slate-200 disabled:text-slate-400 text-white disabled:cursor-not-allowed font-extrabold px-6 py-4 rounded-2xl text-base transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
          >
            <Send size={20} />
            Enviar pedido por WhatsApp
          </motion.button>
          <p className="text-xs text-slate-400 text-center mt-3">
            Se abrirá WhatsApp con todos los detalles de tu pedido.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}
