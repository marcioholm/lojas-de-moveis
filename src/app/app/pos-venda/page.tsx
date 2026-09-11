'use client'

import { useState } from 'react'
import { Search, Filter, PhoneCall, Star } from 'lucide-react'

const mockPosVenda = [
  { id: 'PV-201', cliente: 'Ana Clara Souza', venda: 'VD-1025', dataVenda: '10/10/2023', contatoPrevisto: '25/10/2023', status: 'Pendente', nota: null },
  { id: 'PV-202', cliente: 'Maria Silva Oliveira', venda: 'VD-1020', dataVenda: '05/10/2023', contatoPrevisto: '20/10/2023', status: 'Realizado', nota: 5 },
]

export default function PosVendaPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Pós-Venda</h1>
          <p className="text-[var(--text-muted)] text-sm">Fidelização e acompanhamento de satisfação</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Venda Ref.</th>
                <th className="p-4 font-semibold">Data da Venda</th>
                <th className="p-4 font-semibold">Contato Previsto</th>
                <th className="p-4 font-semibold">Satisfação</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockPosVenda.map((pv) => (
                <tr key={pv.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 font-medium text-sm text-[var(--text-primary)]">{pv.cliente}</td>
                  <td className="p-4 text-sm text-[var(--primary)] font-mono">{pv.venda}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{pv.dataVenda}</td>
                  <td className="p-4 text-sm font-medium text-[var(--text-secondary)]">{pv.contatoPrevisto}</td>
                  <td className="p-4">
                    {pv.nota ? (
                      <div className="flex items-center gap-1 text-[var(--warning)]">
                        {[...Array(pv.nota)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${pv.status === 'Realizado' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {pv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Registrar Contato">
                      <PhoneCall size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
