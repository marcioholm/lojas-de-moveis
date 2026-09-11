'use client'

import { useState } from 'react'
import { Search, Plus, Filter, Wrench, Clock, CheckCircle } from 'lucide-react'

const mockOrdens = [
  { id: 'OS-1001', cliente: 'Maria Silva Oliveira', produto: 'Guarda-Roupa Casal Mônaco 6 Portas', dataAgendada: '01/11/2023', equipe: 'Equipe Alpha (João)', status: 'Pendente', tipo: 'Montagem' },
  { id: 'OS-1002', cliente: 'Carlos Eduardo Ferreira', produto: 'Sofá Retrátil Torino 2,30m Veludo', dataAgendada: '28/10/2023', equipe: 'Equipe Beta (Pedro)', status: 'Em Andamento', tipo: 'Assistência Técnica' },
  { id: 'OS-1003', cliente: 'Ana Clara Souza', produto: 'Mesa de Jantar Ágata 6 Lugares', dataAgendada: '25/10/2023', equipe: 'Equipe Alpha (João)', status: 'Concluída', tipo: 'Montagem' },
]

export default function OrdensPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrdens = mockOrdens.filter(os => 
    os.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Ordens de Serviço</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de montagens e assistência técnica</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nova OS</span>
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
              placeholder="Buscar por cliente, OS..." 
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
                <th className="p-4 font-semibold">OS / Tipo</th>
                <th className="p-4 font-semibold">Cliente / Produto</th>
                <th className="p-4 font-semibold">Equipe</th>
                <th className="p-4 font-semibold">Agendamento</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdens.map((os) => (
                <tr key={os.id} className="border-b border-[var(--border)] hover:bg-black/5 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-[var(--primary)]">{os.id}</span>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{os.tipo}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{os.cliente}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{os.produto}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {os.equipe}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {os.dataAgendada}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${os.status === 'Concluída' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20' : 
                        os.status === 'Em Andamento' ? 'bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/20' :
                        'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20'}
                    `}>
                      {os.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {os.status !== 'Concluída' && (
                        <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--success)] hover:bg-[var(--success-bg)] rounded-md transition-colors" title="Marcar como Concluída">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors" title="Ver Detalhes">
                        <Wrench size={16} />
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
