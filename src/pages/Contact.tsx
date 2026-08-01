import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', messaggio: '' });

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12">
        <h1 className="display-text text-4xl md:text-6xl mb-2">Contatti</h1>
        <p className="text-carta/60 text-sm mb-12">Scrivici per qualsiasi domanda</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Email</h2>
              </div>
              <a href="mailto:info@coloradostore.it" className="text-carta/80 hover:text-carta transition-colors">info@coloradostore.it</a>
            </div>
            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Phone size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Telefono</h2>
              </div>
              <p className="text-carta/80">+39 0825 00 00 00</p>
            </div>
            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Negozio</h2>
              </div>
              <p className="text-carta/80">Corso Vittorio Emanuele II, 42</p>
              <p className="text-carta/80">83100 Avellino (AV)</p>
            </div>
            <a
              href="https://wa.me/390825000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 bg-sabbia/10 border border-sabbia/30 label text-sabbia hover:bg-sabbia/20 transition-colors"
            >
              <MessageCircle size={16} /> Scrivici su WhatsApp
            </a>
          </div>

          <div className="border border-carta/10 p-6">
            <h2 className="display-text text-2xl mb-6">Inviaci un messaggio</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="display-text text-2xl text-sabbia mb-2">Messaggio inviato</p>
                <p className="text-sm text-carta/60">Ti risponderemo entro 24 ore.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="label text-carta/50 block mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                    className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta placeholder:text-carta/30 outline-none focus:border-sabbia transition-colors"
                  />
                </div>
                <div>
                  <label className="label text-carta/50 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta placeholder:text-carta/30 outline-none focus:border-sabbia transition-colors"
                  />
                </div>
                <div>
                  <label className="label text-carta/50 block mb-1.5">Messaggio</label>
                  <textarea
                    value={form.messaggio}
                    onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta placeholder:text-carta/30 outline-none focus:border-sabbia transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 w-full py-3 bg-carta text-inchiostro label hover:bg-sabbia transition-colors justify-center"
                >
                  Invia <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
