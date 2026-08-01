import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Truck, CreditCard, FileText, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const STEPS = ['Spedizione', 'Pagamento', 'Riepilogo'];

export default function CheckoutPage() {
  const { cart } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: '',
    nome: '',
    cognome: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
    telefono: '',
    pagamento: 'carta',
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 6.9;
  const total = subtotal + shipping;

  if (cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-inchiostro text-carta flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="display-text text-4xl text-carta/50 mb-4">Il carrello è vuoto</p>
          <Link to="/collezioni/uomo" className="inline-flex items-center gap-2 label text-sabbia hover:text-carta transition-colors">
            Esplora il catalogo <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i === step ? 'bg-sabbia text-inchiostro' : i < step ? 'bg-sabbia/30 text-sabbia' : 'bg-carta/10 text-carta/40'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </span>
                <span className={`label hidden md:inline ${i === step ? 'text-carta' : 'text-carta/40'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={16} className="text-carta/20" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="display-text text-3xl mb-6">Spedizione</h2>
                  <div className="space-y-4">
                    <Input label="Email" value={form.email} onChange={(v) => update('email', v)} type="email" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nome" value={form.nome} onChange={(v) => update('nome', v)} />
                      <Input label="Cognome" value={form.cognome} onChange={(v) => update('cognome', v)} />
                    </div>
                    <Input label="Indirizzo" value={form.indirizzo} onChange={(v) => update('indirizzo', v)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Città" value={form.citta} onChange={(v) => update('citta', v)} />
                      <Input label="CAP" value={form.cap} onChange={(v) => update('cap', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Provincia" value={form.provincia} onChange={(v) => update('provincia', v)} />
                      <Input label="Telefono" value={form.telefono} onChange={(v) => update('telefono', v)} type="tel" />
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="mt-8 w-full py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors">
                    Continua al pagamento
                  </button>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="display-text text-3xl mb-6">Pagamento</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'carta', label: 'Carta di credito', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: CreditCard },
                      { id: 'contrassegno', label: 'Contrassegno', icon: FileText },
                      { id: 'ritiro', label: 'Ritiro in negozio (Avellino) — gratis, pronto in 24h', icon: Truck },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => update('pagamento', method.id)}
                        className={`flex items-center gap-4 w-full p-4 border transition-colors ${
                          form.pagamento === method.id ? 'border-sabbia bg-sabbia/5' : 'border-carta/20 hover:border-carta/50'
                        }`}
                      >
                        <method.icon size={20} className={form.pagamento === method.id ? 'text-sabbia' : 'text-carta/50'} />
                        <span className="text-sm text-carta">{method.label}</span>
                        <span className={`ml-auto w-4 h-4 rounded-full border-2 ${form.pagamento === method.id ? 'border-sabbia bg-sabbia' : 'border-carta/30'}`} />
                      </button>
                    ))}
                  </div>
                  {form.pagamento === 'carta' && (
                    <div className="mt-6 space-y-4">
                      <Input label="Numero carta" value="" onChange={() => {}} placeholder="0000 0000 0000 0000" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Scadenza" value="" onChange={() => {}} placeholder="MM/AA" />
                        <Input label="CVV" value="" onChange={() => {}} placeholder="000" />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(0)} className="px-6 py-4 border border-carta/30 label text-carta/70 hover:bg-carta/10 transition-colors">
                      Indietro
                    </button>
                    <button onClick={() => setStep(2)} className="flex-1 py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors">
                      Vai al riepilogo
                    </button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="display-text text-3xl mb-6">Riepilogo</h2>
                  <div className="space-y-4 text-sm">
                    <div className="border border-carta/10 p-4">
                      <p className="label text-sabbia mb-2">Spedizione</p>
                      <p className="text-carta/70">{form.nome} {form.cognome}</p>
                      <p className="text-carta/70">{form.indirizzo}, {form.cap} {form.citta} ({form.provincia})</p>
                      <p className="text-carta/70">{form.email} · {form.telefono}</p>
                    </div>
                    <div className="border border-carta/10 p-4">
                      <p className="label text-sabbia mb-2">Pagamento</p>
                      <p className="text-carta/70 capitalize">{form.pagamento === 'carta' ? 'Carta di credito' : form.pagamento === 'paypal' ? 'PayPal' : form.pagamento === 'ritiro' ? 'Ritiro in negozio (Avellino)' : 'Contrassegno'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="px-6 py-4 border border-carta/30 label text-carta/70 hover:bg-carta/10 transition-colors">
                      Indietro
                    </button>
                    <button className="flex-1 py-4 bg-rame text-carta label hover:bg-rame-500 transition-colors">
                      Conferma ordine
                    </button>
                  </div>
                  <p className="text-xs text-carta/40 mt-4 text-center">
                    In produzione, il checkout reindirizzerà al checkout sicuro Shopify.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="bg-inchiostro-400 p-6 h-fit">
            <h3 className="label-lg text-sabbia mb-4">Il tuo ordine</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-3">
                  <img src={line.image.url} alt={line.image.altText} width={56} height={64} className="w-14 h-16 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-carta truncate">{line.productTitle}</p>
                    <p className="text-[10px] text-carta/50">{line.variantTitle}</p>
                    <p className="text-xs text-carta/70">Qt. {line.quantity}</p>
                  </div>
                  <span className="text-xs text-carta">{(parseFloat(line.price.amount) * line.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="border-t border-carta/10 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-carta/60">
                <span>Subtotale</span><span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-carta/60">
                <span className="flex items-center gap-1"><Truck size={12} /> Spedizione</span>
                <span>{shipping === 0 ? 'Gratuita' : `${shipping.toFixed(2)}€`}</span>
              </div>
              <div className="flex justify-between text-carta pt-2 border-t border-carta/10">
                <span className="display-text text-xl">Totale</span>
                <span className="display-text text-xl">{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label text-carta/50 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta placeholder:text-carta/30 outline-none focus:border-sabbia transition-colors"
      />
    </div>
  );
}
