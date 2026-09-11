'use client'

import { useState } from 'react'
import { Search, Plus, Filter, FileText, CheckCircle } from 'lucide-react'
import { mockContasPagar } from '@/lib/mockData'

export default function ContasPagarPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContas = mockContasPagar.filter(c => 
    c.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Contas a Pagar</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de despesas, fornecedores e boletos</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nova Despesa</span>
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
              placeholder="Buscar por fornecedor, descrição..." 
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
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Fornecedor / Despesa</th>
                <th className="p-4 font-semibold">Descrição</th>
                <th className="p-4 font-semibold">Vencimento</th>
                <th className="p-4 font-semibold text-right">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContas.map((conta) => (
                <tr key={conta.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-sm font-medium text-[var(--text-secondary)]">{conta.id}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{conta.fornecedor}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {conta.descricao}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {conta.vencimento}
                  </td>
                  <td className="p-4 text-sm font-bold text-[var(--danger)] text-right">
                    R$ {conta.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${conta.status === 'Pago' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {conta.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Ver Comprovante/Anexo">
                        <FileText size={16} />
                      </button>
                      {conta.status !== 'Pago' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Dar Baixa">
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredContas.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Nenhuma conta encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
