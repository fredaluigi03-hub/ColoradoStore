import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, AlertTriangle, Clock } from 'lucide-react';

const SALES_DATA = [
  { month: 'Gen', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'Mag', value: 58 },
  { month: 'Giu', value: 72 },
  { month: 'Lug', value: 68 },
  { month: 'Ago', value: 81 },
];

const ORDERS = [
  { id: '#1042', cliente: 'Marco R.', prodotti: 3, totale: '289.00', stato: 'Completato', data: '01 Ago' },
  { id: '#1041', cliente: 'Giulia S.', prodotti: 1, totale: '119.00', stato: 'Spedito', data: '01 Ago' },
  { id: '#1040', cliente: 'Luca B.', prodotti: 2, totale: '198.00', stato: 'In lavorazione', data: '31 Lug' },
  { id: '#1039', cliente: 'Anna M.', prodotti: 1, totale: '169.00', stato: 'Completato', data: '31 Lug' },
  { id: '#1038', cliente: 'Francesco T.', prodotti: 4, totale: '456.00', stato: 'Spedito', data: '30 Lug' },
  { id: '#1037', cliente: 'Chiara D.', prodotti: 2, totale: '238.00', stato: 'Completato', data: '30 Lug' },
];

const INVENTORY = [
  { name: 'Jeans 501® Original', sku: '501-BLU', stock: 3, max: 20, status: 'low' },
  { name: 'Felpa Hoodie Navy', sku: 'HOD-NVY', stock: 7, max: 15, status: 'ok' },
  { name: 'Camicia Oxford', sku: 'OXF-WHT', stock: 2, max: 12, status: 'low' },
  { name: 'Sneaker Navy Low', sku: 'SNK-NVY', stock: 11, max: 20, status: 'ok' },
  { name: 'Cardigan Camoscio', sku: 'CDG-MAR', stock: 0, max: 8, status: 'out' },
  { name: 'Trench Beige', sku: 'TRC-BGE', stock: 5, max: 10, status: 'ok' },
];

const ACTIVITY = [
  { text: 'Nuovo ordine #1042 da Marco R.', time: '2 min fa' },
  { text: 'Scorta bassa: Camicia Oxford', time: '15 min fa' },
  { text: 'Ordine #1041 spedito', time: '1 ora fa' },
  { text: 'Nuovo cliente: Giulia S.', time: '2 ore fa' },
  { text: 'Prodotto esaurito: Cardigan Camoscio', time: '3 ore fa' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Vendite (mese)', value: '€ 12.450', change: '+18%', up: true, icon: TrendingUp },
    { label: 'Ordini', value: '142', change: '+12%', up: true, icon: ShoppingCart },
    { label: 'Clienti', value: '1.284', change: '+5%', up: true, icon: Users },
    { label: 'Giacenza media', value: '68%', change: '-3%', up: false, icon: Package },
  ];

  const maxSale = Math.max(...SALES_DATA.map((d) => d.value));

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-16 md:pt-20">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="label text-sabbia">Pannello di gestione</span>
            <h1 className="display-text text-carta text-4xl md:text-5xl mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-carta/50">
            <Clock size={14} />
            Ultimo aggiornamento: adesso
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {['dashboard', 'ordini', 'inventario', 'clienti'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 label whitespace-nowrap transition-colors capitalize ${
                activeTab === tab ? 'bg-carta text-inchiostro' : 'border border-carta/20 text-carta/60 hover:border-carta/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-inchiostro-400 border border-carta/10 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <stat.icon size={18} className="text-sabbia" />
                    <span className={`text-xs flex items-center gap-1 ${stat.up ? 'text-sabbia' : 'text-rame'}`}>
                      {stat.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="display-text text-2xl text-carta">{stat.value}</p>
                  <p className="label text-carta/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Sales chart */}
              <div className="lg:col-span-2 bg-inchiostro-400 border border-carta/10 p-6">
                <h3 className="label-lg text-sabbia mb-6">Vendite mensili</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                  {SALES_DATA.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.value / maxSale) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                        className="w-full bg-gradient-to-t from-denim-500 to-sabbia rounded-t-sm min-h-[2px]"
                        style={{ height: `${(d.value / maxSale) * 100}%` }}
                      />
                      <span className="text-[9px] text-carta/40">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="bg-inchiostro-400 border border-carta/10 p-6">
                <h3 className="label-lg text-sabbia mb-4">Attività recenti</h3>
                <div className="space-y-3">
                  {ACTIVITY.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        act.text.includes('esaurito') || act.text.includes('bassa') ? 'bg-rame' : 'bg-sabbia'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-carta/70 text-xs leading-snug">{act.text}</p>
                        <p className="text-carta/30 text-[10px] mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders table */}
            <div className="bg-inchiostro-400 border border-carta/10 p-6 mt-6">
              <h3 className="label-lg text-sabbia mb-4">Ordini recenti</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-carta/10">
                      <th className="text-left label text-carta/40 py-3">Ordine</th>
                      <th className="text-left label text-carta/40 py-3">Cliente</th>
                      <th className="text-left label text-carta/40 py-3 hidden md:table-cell">Prodotti</th>
                      <th className="text-left label text-carta/40 py-3">Totale</th>
                      <th className="text-left label text-carta/40 py-3">Stato</th>
                      <th className="text-left label text-carta/40 py-3 hidden md:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-carta/5 hover:bg-carta/5 transition-colors">
                        <td className="py-3 text-carta font-medium">{order.id}</td>
                        <td className="py-3 text-carta/70">{order.cliente}</td>
                        <td className="py-3 text-carta/60 hidden md:table-cell">{order.prodotti}</td>
                        <td className="py-3 text-carta">{order.totale}€</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 ${
                            order.stato === 'Completato' ? 'bg-sabbia/20 text-sabbia' :
                            order.stato === 'Spedito' ? 'bg-denim/20 text-denim-50' :
                            'bg-rame/20 text-rame-50'
                          }`}>
                            {order.stato}
                          </span>
                        </td>
                        <td className="py-3 text-carta/50 hidden md:table-cell">{order.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory alerts */}
            <div className="bg-inchiostro-400 border border-carta/10 p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-rame" />
                <h3 className="label-lg text-rame">Inventario — Avvisi scorta</h3>
              </div>
              <div className="space-y-3">
                {INVENTORY.map((item) => (
                  <div key={item.sku} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-carta">{item.name}</p>
                      <p className="text-xs text-carta/40">{item.sku}</p>
                    </div>
                    <div className="w-32 h-1.5 bg-carta/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.status === 'out' ? 'bg-rame' : item.status === 'low' ? 'bg-rame-100' : 'bg-sabbia'}`}
                        style={{ width: `${(item.stock / item.max) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm w-12 text-right ${item.status === 'out' ? 'text-rame' : item.status === 'low' ? 'text-rame-100' : 'text-carta/60'}`}>
                      {item.stock}/{item.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab !== 'dashboard' && (
          <div className="bg-inchiostro-400 border border-carta/10 p-12 text-center">
            <p className="display-text text-2xl text-carta/50">Sezione {activeTab}</p>
            <p className="text-sm text-carta/30 mt-2">Nella versione reale, qui troverai la gestione completa di {activeTab}.</p>
          </div>
        )}

        <p className="text-xs text-carta/30 mt-8 text-center max-w-xl mx-auto">
          Questo è un mockup dimostrativo. Nella versione reale, la gestione avviene tramite il pannello Shopify.
        </p>
      </div>
    </div>
  );
}
