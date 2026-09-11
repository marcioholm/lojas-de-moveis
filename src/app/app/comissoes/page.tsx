'use client'

import { useState } from 'react'
import { Search, Filter, HandCoins, CheckCircle } from 'lucide-react'
import { mockComissoes } from '@/lib/mockData'

export default function ComissoesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComissoes = mockComissoes.filter(c => 
    c.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Gestão de Comissões</h1>
          <p className="text-[var(--text-muted)] text-sm">Cálculo de comissões, taxas e premiações da equipe de vendas</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/50 border border-[var(--border)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary)]">
            <option>Outubro 2023</option>
            <option>Novembro 2023</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
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
              placeholder="Buscar por vendedor..." 
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
                <th className="p-4 font-semibold">Vendedor</th>
                <th className="p-4 font-semibold text-right">Total Vendas (Mês)</th>
                <th className="p-4 font-semibold text-center">Taxa</th>
                <th className="p-4 font-semibold text-right">Comissão</th>
                <th className="p-4 font-semibold text-right">Prêmios / Bônus</th>
                <th className="p-4 font-semibold text-right bg-[var(--bg-inset)]">Total a Receber</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredComissoes.map((comissao) => (
                <tr key={comissao.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{comissao.vendedor}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] text-right">
                    R$ {comissao.totalVendas.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] text-center">
                    <span className="bg-black/5 px-2 py-1 rounded text-xs">{comissao.taxa}</span>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)] text-right">
                    R$ {comissao.comissao.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4 text-sm text-[var(--success)] font-medium text-right">
                    + R$ {comissao.premios.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4 text-sm font-bold text-[var(--primary)] text-right bg-[var(--bg-inset)]/50">
                    R$ {comissao.totalReceber.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${comissao.status === 'Pago' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {comissao.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {comissao.status !== 'Pago' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Marcar como Pago">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Detalhamento">
                        <HandCoins size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredComissoes.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhum vendedor encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
