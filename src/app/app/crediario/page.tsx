'use client'

import { useState } from 'react'
import { Search, Plus, Filter, Wallet, Printer, FileText, CalendarDays } from 'lucide-react'
import { mockCrediario } from '@/lib/mockData'

export default function CrediarioPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCrediario = mockCrediario.filter(c => 
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Gestão de Crediário</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de carnês e parcelas em aberto</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Novo Carnê</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-[var(--success)]">
          <div className="p-3 bg-[var(--success-bg)] rounded-full text-[var(--success)]">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Recebido Hoje</p>
            <h3 className="text-xl font-bold font-serif text-[var(--text-primary)]">R$ 2.450,00</h3>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-[var(--warning)]">
          <div className="p-3 bg-[var(--warning-bg)] rounded-full text-[var(--warning)]">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Vence Hoje</p>
            <h3 className="text-xl font-bold font-serif text-[var(--text-primary)]">R$ 890,00</h3>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-[var(--danger)]">
          <div className="p-3 bg-[var(--danger-bg)] rounded-full text-[var(--danger)]">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Atrasados (Geral)</p>
            <h3 className="text-xl font-bold font-serif text-[var(--danger)]">R$ 4.230,00</h3>
          </div>
        </div>
      </div>

      {/* Glass Panel Table */}
      <div className="glass-panel p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por ID, Cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="p-4 font-semibold">Carnê</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold text-center">Parcela</th>
                <th className="p-4 font-semibold">Vencimento</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrediario.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-[var(--primary)]">{item.id}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.cliente}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2 py-1 bg-black/5 rounded text-xs font-bold text-[var(--text-secondary)]">{item.carne}</span>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {item.vencimento}
                  </td>
                  <td className="p-4 text-sm font-bold text-[var(--text-primary)] text-right">
                    R$ {item.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        ${item.status === 'Em Dia' ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--danger-bg)] text-[var(--danger)]'}
                      `}>
                        {item.status}
                      </span>
                      {item.diasAtraso > 0 && (
                        <span className="text-[10px] text-[var(--danger)] font-medium">{item.diasAtraso} dias de atraso</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Ver Detalhes">
                        <FileText size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/10 rounded-md transition-colors" title="Imprimir Carnê">
                        <Printer size={16} />
                      </button>
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Receber Parcela">
                        <Wallet size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCrediario.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma parcela encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
