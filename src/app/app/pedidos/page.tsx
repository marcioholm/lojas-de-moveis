'use client'

import { useState } from 'react'
import { Search, Plus, Filter, ClipboardList, CheckCircle2, Clock, Truck } from 'lucide-react'
import { mockPedidos } from '@/lib/mockData'

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPedidos = mockPedidos.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Fila de Pedidos</h1>
          <p className="text-[var(--text-muted)] text-sm">Acompanhamento de separação, montagem e liberação</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      {/* Kanban / Cards view instead of just table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-[var(--warning)]"></div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">Aguardando Estoque/Montagem</h3>
            <span className="ml-auto bg-black/5 px-2 py-0.5 rounded-full text-xs font-bold text-[var(--text-secondary)]">2</span>
          </div>
          
          {filteredPedidos.filter(p => p.status.includes('Aguardando') || p.status.includes('Montagem')).map(pedido => (
            <div key={pedido.id} className="glass-panel p-4 hover:border-[var(--primary)] transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">{pedido.id}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium px-2 py-1 bg-black/5 rounded">{pedido.origem}</span>
              </div>
              <h4 className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary)] transition-colors">{pedido.cliente}</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">{pedido.produtos}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5 text-xs text-[var(--warning)] font-medium">
                  <Clock size={14} />
                  Prev: {pedido.dataPrevista}
                </div>
                <div className="font-bold text-[var(--text-primary)] text-sm">
                  R$ {pedido.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-[var(--info)]"></div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">Pronto para Entrega</h3>
            <span className="ml-auto bg-black/5 px-2 py-0.5 rounded-full text-xs font-bold text-[var(--text-secondary)]">1</span>
          </div>
          
          {filteredPedidos.filter(p => p.status === 'Pronto para Entrega').map(pedido => (
            <div key={pedido.id} className="glass-panel p-4 hover:border-[var(--info)] transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">{pedido.id}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium px-2 py-1 bg-black/5 rounded">{pedido.origem}</span>
              </div>
              <h4 className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--info)] transition-colors">{pedido.cliente}</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">{pedido.produtos}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5 text-xs text-[var(--info)] font-medium">
                  <Truck size={14} />
                  Agendar Rota
                </div>
                <div className="font-bold text-[var(--text-primary)] text-sm">
                  R$ {pedido.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-[var(--success)]"></div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">Entregue / Finalizado</h3>
            <span className="ml-auto bg-black/5 px-2 py-0.5 rounded-full text-xs font-bold text-[var(--text-secondary)]">0</span>
          </div>
          
          <div className="glass-panel p-8 text-center text-[var(--text-muted)] flex flex-col items-center justify-center opacity-50 border-dashed">
            <CheckCircle2 size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Nenhum pedido finalizado hoje.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
