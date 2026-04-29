import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  FileText, 
  Download, 
  Video, 
  Film, 
  Camera, 
  CheckCircle2, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { Invoice, LineItem, CompanyInfo } from './types';
import { DEFAULT_INVOICE, DEFAULT_COMPANY, CATEGORIES } from './constants';

export default function App() {
  const [invoice, setInvoice] = useState<Invoice>(DEFAULT_INVOICE);
  const [company, setCompany] = useState<CompanyInfo>(DEFAULT_COMPANY);
  const [isSaved, setIsSaved] = useState(false);

  const subtotal = useMemo(() => {
    return invoice.lineItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  }, [invoice.lineItems]);

  const total = subtotal + invoice.taxAmount - invoice.discount;

  const handleUpdateInvoice = (updates: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...updates }));
    setIsSaved(false);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      category: 'production'
    };
    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: invoice.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
              <Video className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">CineInvoice</h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Video Production Billing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSaved(true)} 
              className="btn-secondary text-sm"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Download className="w-4 h-4" />}
              {isSaved ? 'Saved Locally' : 'Save Draft'}
            </button>
            <button onClick={handlePrint} className="btn-primary text-sm">
              <Printer className="w-4 h-4" />
              Generate PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
        
        {/* Editor Side */}
        <div className="lg:col-span-7 space-y-6 no-print">
          <section className="card-glass p-6">
            <div className="flex items-center gap-2 mb-6 border-l-2 border-red-600 pl-4">
              <Video className="w-4 h-4 text-red-500" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-zinc-400">Business Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-text">Company Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={company.name}
                  onChange={e => setCompany(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={company.email}
                    onChange={e => setCompany(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-text">Tagline</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={company.tagline}
                    onChange={e => setCompany(prev => ({ ...prev, tagline: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label-text">Business Address</label>
                <textarea 
                  className="input-field h-20 resize-none" 
                  value={company.address}
                  onChange={e => setCompany(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <section className="card-glass p-6">
            <div className="flex items-center gap-2 mb-6 border-l-2 border-red-600 pl-4">
              <Camera className="w-4 h-4 text-red-500" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-zinc-400">Project Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Project Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={invoice.projectName}
                  onChange={e => handleUpdateInvoice({ projectName: e.target.value })}
                  placeholder="e.g. Summer Brand Film 2024"
                />
              </div>
              <div>
                <label className="label-text">Invoice Number</label>
                <input 
                  type="text" 
                  className="input-field mono-value" 
                  value={invoice.invoiceNumber}
                  onChange={e => handleUpdateInvoice({ invoiceNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">Issue Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="input-field pl-10" 
                    value={invoice.issueDate}
                    onChange={e => handleUpdateInvoice({ issueDate: e.target.value })}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                </div>
              </div>
              <div>
                <label className="label-text">Due Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="input-field pl-10" 
                    value={invoice.dueDate}
                    onChange={e => handleUpdateInvoice({ dueDate: e.target.value })}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                </div>
              </div>
            </div>
          </section>

          <section className="card-glass p-6">
            <div className="flex items-center gap-2 mb-6 border-l-2 border-red-600 pl-4">
              <FileText className="w-4 h-4 text-red-500" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-zinc-400">Client Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="label-text">Client / Agency Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={invoice.clientName}
                  onChange={e => handleUpdateInvoice({ clientName: e.target.value })}
                  placeholder="e.g. Acme Marketing Group"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Email Address</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={invoice.clientEmail}
                    onChange={e => handleUpdateInvoice({ clientEmail: e.target.value })}
                    placeholder="billing@client.com"
                  />
                </div>
                <div>
                  <label className="label-text">Billing Address</label>
                  <textarea 
                    className="input-field h-[42px] resize-none" 
                    value={invoice.clientAddress}
                    onChange={e => handleUpdateInvoice({ clientAddress: e.target.value })}
                    placeholder="123 Production Way, CA 90210"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="card-glass p-6">
            <div className="flex items-center justify-between mb-6 border-l-2 border-red-600 pl-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                <h2 className="text-sm uppercase tracking-widest font-bold text-zinc-400">Line Items</h2>
              </div>
              <button onClick={addLineItem} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-400 font-bold transition-colors">
                <Plus className="w-3 h-3" />
                ADD ITEM
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {invoice.lineItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-12 gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg group"
                  >
                    <div className="col-span-12 md:col-span-5">
                      <label className="label-text">Description</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={item.description}
                        onChange={e => updateLineItem(item.id, { description: e.target.value })}
                        placeholder="e.g. Editing - Draft 1"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="label-text">Qty / Days</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={item.quantity}
                        onChange={e => updateLineItem(item.id, { quantity: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="label-text">Rate</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={item.rate}
                        onChange={e => updateLineItem(item.id, { rate: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-span-10 md:col-span-2 flex flex-col justify-end">
                       <label className="label-text">Category</label>
                       <select 
                        className="input-field text-xs py-[9px]"
                        value={item.category}
                        onChange={e => updateLineItem(item.id, { category: e.target.value as any })}
                       >
                         {CATEGORIES.map(cat => (
                           <option key={cat.value} value={cat.value}>{cat.label}</option>
                         ))}
                       </select>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-end justify-center mb-1">
                      <button 
                        onClick={() => removeLineItem(item.id)}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className="card-glass p-6">
            <div className="flex items-center gap-2 mb-6 border-l-2 border-red-600 pl-4">
              <CreditCard className="w-4 h-4 text-red-500" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-zinc-400">Notes & Adjustment</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-text">Tax Amount (Rp)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={invoice.taxAmount}
                  onChange={e => handleUpdateInvoice({ taxAmount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label-text">Fixed Discount (Rp)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={invoice.discount}
                  onChange={e => handleUpdateInvoice({ discount: Number(e.target.value) })}
                />
              </div>
            </div>

            <textarea 
              className="input-field h-32 resize-none" 
              value={invoice.notes}
              onChange={e => handleUpdateInvoice({ notes: e.target.value })}
              placeholder="Bank Transfer Details, Terms, Deliverables list..."
            />
          </section>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4 no-print border-l-2 border-zinc-700 pl-4">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">Live Preview</h2>
            </div>
            
            <div id="invoice-preview" className="bg-white text-zinc-900 rounded-xl shadow-2xl p-8 min-h-[600px] border border-zinc-200">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="w-6 h-6 text-red-600" />
                    <span className="text-xl font-black tracking-tighter uppercase italic">{company.name}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{company.tagline}</p>
                  <p className="text-xs mt-4 text-zinc-600 leading-relaxed font-medium whitespace-pre-line">
                    {company.address}
                  </p>
                  <p className="text-xs text-zinc-600 font-medium">
                    {company.email}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black italic tracking-tighter text-zinc-900 mb-2">INVOICE</h2>
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Number</p>
                    <p className="text-sm font-mono font-bold tracking-tight">{invoice.invoiceNumber || '---'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 bg-zinc-50 p-6 rounded-lg border border-zinc-100">
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Bill To</p>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1">{invoice.clientName || 'Add Client Name'}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium capitalize h-8">{invoice.clientAddress || 'Address not set'}</p>
                  <p className="text-xs text-zinc-600 font-medium">{invoice.clientEmail}</p>
                </div>
                <div className="text-right space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Issue Date</p>
                    <p className="text-xs font-bold text-zinc-900">{invoice.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Payment Due</p>
                    <p className="text-xs font-bold text-red-600">{invoice.dueDate}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] flex-1 bg-zinc-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Line Items</span>
                  <div className="h-[1px] flex-1 bg-zinc-200" />
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Info</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Qty</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Rate</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-zinc-50 last:border-b-0">
                        <td className="py-4">
                          <p className="text-xs font-bold text-zinc-900">{item.description || "Untitle Item"}</p>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-red-500/70">{item.category}</span>
                        </td>
                        <td className="py-4 text-xs font-mono font-bold text-center text-zinc-600">{item.quantity}</td>
                        <td className="py-4 text-xs font-mono font-bold text-right text-zinc-600">{formatCurrency(item.rate)}</td>
                        <td className="py-4 text-xs font-mono font-bold text-right text-zinc-900">{formatCurrency(item.quantity * item.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-8 mt-auto border-t border-zinc-200">
                <div className="w-48 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-mono font-bold text-zinc-600">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest">Tax</span>
                    <span className="font-mono font-bold text-zinc-600">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-bold uppercase tracking-widest text-red-500">Discount</span>
                      <span className="font-mono font-bold text-red-500">-{formatCurrency(invoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-t-2 border-zinc-900">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Total Due</span>
                    <span className="text-lg font-mono font-black text-red-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-12 p-4 bg-zinc-50 rounded-lg border-l-4 border-zinc-200">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Production Notes</p>
                  <p className="text-[11px] text-zinc-600 leading-relaxed italic whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}

              <footer className="mt-12 text-center">
                 <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">Thank you for filming with us</p>
              </footer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

