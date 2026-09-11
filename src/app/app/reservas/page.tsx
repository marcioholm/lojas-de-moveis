'use client'

import { useState } from 'react'
import { Search, Plus, Filter, CalendarDays, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// Using mock data directly here for simplicity since it's a small specific screen
const mockReservas = [
  { id: 'RS-901', produto: 'Sofá Retrátil Torino 2,30m Veludo', cliente: 'Maria Silva Oliveira', vendedor: 'Carlos', dataReserva: '28/10/2023', vencimento: '30/10/2023', status: 'Ativa' },
  { id: 'RS-902', produto: 'Guarda-Roupa Casal Mônaco 6 Portas', cliente: 'Cliente Balcão', vendedor: 'Ana', dataReserva: '25/10/2023', vencimento: '27/10/2023', status: 'Vencida' },
  { id: 'RS-903', produto: 'Cama Box Queen Size Molas Ensacadas', cliente: 'João Pedro Santos', vendedor: 'Roberto', dataReserva: '29/10/2023', vencimento: '31/10/2023', status: 'Ativa' },
]

export default function ReservasPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReservas = mockReservas.filter(r => 
    r.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Reservas de Produtos</h1>
          <p className="text-[var(--text-muted)] text-sm">Controle de mercadorias reservadas no estoque</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nova Reserva</span>
          </button>
        </div>
      </div>

      {/* Glass Panel */}
      <div className="glass-panel p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--bg-inset)]">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Buscar por produto, cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/[0.02]">
          {filteredReservas.map(reserva => (
            <div key={reserva.id} className={`glass-panel p-5 relative overflow-hidden ${reserva.status === 'Vencida' ? 'border-[var(--danger)]/30 bg-[var(--danger-bg)]/50' : 'border-[var(--border-light)] hover:border-[var(--primary)]/50'}`}>
              
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-bold text-[var(--text-secondary)]">{reserva.id}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                  ${reserva.status === 'Ativa' ? 'bg-[var(--info-bg)] text-[var(--info)]' : 'bg-[var(--danger-bg)] text-[var(--danger)]'}
                `}>
                  {reserva.status}
                </span>
              </div>
              
              <h3 className="font-medium text-[var(--text-primary)] text-sm leading-tight mb-2">{reserva.produto}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-4">Reservado para: <strong className="text-[var(--text-secondary)]">{reserva.cliente}</strong></p>
              
              <div className="flex items-center gap-4 text-xs mt-auto pt-4 border-t border-black/5">
                <div className="flex flex-col">
                  <span className="text-[var(--text-muted)] mb-0.5">Data</span>
                  <span className="font-medium text-[var(--text-secondary)]">{reserva.dataReserva}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--text-muted)] mb-0.5">Vencimento</span>
                  <span className={`font-medium ${reserva.status === 'Vencida' ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'}`}>
                    {reserva.vencimento}
                  </span>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent opacity-0 hover:opacity-100 transition-opacity flex justify-end gap-2 items-end h-full backdrop-blur-[2px]">
                {reserva.status === 'Ativa' ? (
                  <>
                    <button className="btn-secondary py-1.5 px-3 text-xs bg-white text-[var(--danger)] border-[var(--danger)]/30 hover:bg-[var(--danger-bg)]">Cancelar Reserva</button>
                    <button className="btn-primary py-1.5 px-3 text-xs shadow-md">Efetivar Venda</button>
                  </>
                ) : (
                  <button className="btn-secondary py-1.5 px-3 text-xs w-full bg-white text-[var(--text-primary)]">Liberar Estoque</button>
                )}
              </div>
            </div>
          ))}
          
          {filteredReservas.length === 0 && (
            <div className="col-span-full p-12 text-center text-[var(--text-muted)]">
              Nenhuma reserva encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
