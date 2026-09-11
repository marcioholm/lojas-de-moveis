'use client'

import { useState } from 'react'
import { Search, Filter, RotateCcw, CheckCircle } from 'lucide-react'

const mockDevolucoes = [
  { id: 'DEV-301', cliente: 'João Pedro Santos', produto: 'Mesa de Jantar Ágata 6 Lugares', motivo: 'Avaria no transporte', dataSolicitacao: '28/10/2023', valor: 1850.00, status: 'Em Análise' },
]

export default function DevolucoesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Devoluções e Trocas</h1>
          <p className="text-[var(--text-muted)] text-sm">Gestão de logística reversa e avarias</p>
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
              placeholder="Buscar cliente, produto..." 
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
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Cliente / Produto</th>
                <th className="p-4 font-semibold">Motivo</th>
                <th className="p-4 font-semibold">Solicitação</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockDevolucoes.map((dev) => (
                <tr key={dev.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4 text-sm font-bold font-mono text-[var(--danger)]">{dev.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{dev.cliente}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{dev.produto}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{dev.motivo}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{dev.dataSolicitacao}</td>
                  <td className="p-4 text-sm font-medium text-[var(--danger)] text-right">R$ {dev.valor.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20">
                      {dev.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-md transition-colors" title="Aprovar Troca">
                        <RotateCcw size={16} />
                      </button>
                    </div>
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
